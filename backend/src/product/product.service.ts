import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entities';
import { Users } from 'src/components/user/user.entities';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { AssignPartnerDto } from './assign-partner.dto';
import { Partner } from 'src/components/partner/partner.entities';

function canEditProduct(user: Users, product: Product): boolean {
  if (!user) return false;
  if (user.roles?.roleName === 'admin') return true;
  if (user.roles?.roleName === 'partner') {
    if (product.assignedPartner?.user?.id === user.id) return true;
    if (product.createdBy?.id === user.id) return true;
  }
  return false;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
  ) {}

  private async ensureUserWithRole(currentUser: Users): Promise<Users> {
    if (currentUser && currentUser.roles && currentUser.roles.roleName)
      return currentUser;
    const me = await this.usersRepo.findOne({
      where: { id: currentUser.id },
      relations: ['roles'],
    });
    if (!me) throw new NotFoundException('Current user not found');
    return me;
  }

  async createWithImage(
    dto: CreateProductDto,
    imagePath: string,
    currentUser: Users,
  ) {
    const me = await this.ensureUserWithRole(currentUser);

    let partnerEntity: Partner | null = null;
    if (dto.assignedPartnerId) {
      partnerEntity = await this.partnerRepo.findOne({
        where: { id: dto.assignedPartnerId },
        relations: ['user'],
      });
      if (!partnerEntity) {
        throw new BadRequestException('Invalid partner selected');
      }
    }

    const newProduct = this.productRepo.create({
      name: dto.name || '',
      price: dto.price ?? 0,
      quantity: dto.quantity ?? 1,
      description: dto.description ?? '',
      createdBy: me,
      imageUrl: imagePath,
      assignedPartner: partnerEntity ?? undefined,
    });

    const saved = await this.productRepo.save(newProduct);

    return this.productRepo.findOne({
      where: { id: saved.id },
      relations: ['createdBy', 'assignedPartner', 'assignedPartner.user'],
    });
  }

  async findOne(id: number) {
    const p = await this.productRepo.findOne({
      where: { id },
      relations: ['createdBy', 'assignedPartner', 'assignedPartner.user'],
    });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async update(id: number, dto: UpdateProductDto, currentUser: Users) {
    const me = await this.ensureUserWithRole(currentUser);
    const product = await this.findOne(id);

    if (!canEditProduct(me, product))
      throw new ForbiddenException('Not allowed');

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.quantity !== undefined) product.quantity = dto.quantity;
    if (dto.description !== undefined) product.description = dto.description;

    if (dto.assignedPartnerId !== undefined) {
      if (me.roles.roleName !== 'admin')
        throw new ForbiddenException('Only admin can reassign partner');

      const partner = await this.partnerRepo.findOne({
        where: { id: dto.assignedPartnerId },
        relations: ['user'],
      });
      if (!partner) throw new BadRequestException('Invalid partner');
      product.assignedPartner = partner;
    }

    const saved = await this.productRepo.save(product);
    return this.findOne(saved.id);
  }

  async assignPartner(id: number, dto: AssignPartnerDto, currentUser: Users) {
    const me = await this.ensureUserWithRole(currentUser);
    if (me.roles.roleName !== 'admin')
      throw new ForbiddenException('Only admin can assign partner');

    const product = await this.findOne(id);
    const partner = await this.partnerRepo.findOne({
      where: { id: dto.assignedPartnerId },
      relations: ['user'],
    });
    if (!partner) throw new BadRequestException('Invalid partner');

    product.assignedPartner = partner;
    const saved = await this.productRepo.save(product);
    return this.findOne(saved.id);
  }

  async uploadImage(id: number, imagePath: string, currentUser: Users) {
    const me = await this.ensureUserWithRole(currentUser);
    const product = await this.findOne(id);
    if (!canEditProduct(me, product))
      throw new ForbiddenException(
        'Not allowed to upload image for this product',
      );
    product.imageUrl = imagePath;
    const saved = await this.productRepo.save(product);
    return this.findOne(saved.id);
  }

  async findAll() {
    return this.productRepo.find({
      relations: ['createdBy', 'assignedPartner', 'assignedPartner.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findForPartner(partnerId: number) {
    return this.productRepo.find({
      where: { assignedPartner: { id: partnerId } },
      relations: ['assignedPartner', 'assignedPartner.user', 'createdBy'],
    });
  }

  async findForUser(currentUser: Users) {
    const me = await this.ensureUserWithRole(currentUser);

    if (me.roles?.roleName === 'admin') {
      return this.productRepo.find({
        relations: ['createdBy', 'assignedPartner', 'assignedPartner.user'],
        order: { createdAt: 'DESC' },
      });
    }

    if (me.roles?.roleName === 'partner') {
      const partner = await this.partnerRepo.findOne({
        where: { user: { id: me.id } },
      });

      const whereConditions: any[] = [{ createdBy: { id: me.id } }];

      if (partner) {
        whereConditions.push({ assignedPartner: { id: partner.id } });
      }

      return this.productRepo.find({
        where: whereConditions,
        relations: ['createdBy', 'assignedPartner', 'assignedPartner.user'],
        order: { createdAt: 'DESC' },
      });
    }

    if (me.roles?.roleName === 'customer') {
      return this.productRepo.find({
        relations: ['createdBy', 'assignedPartner', 'assignedPartner.user'],
        order: { createdAt: 'DESC' },
      });
    }

    return [];
  }

  async canViewProduct(user: Users, product: Product): Promise<boolean> {
    const me = await this.ensureUserWithRole(user);

    if (me.roles?.roleName === 'admin') return true;
    if (me.roles?.roleName === 'partner') {
      if (product.createdBy?.id === me.id) return true;

      const partner = await this.partnerRepo.findOne({
        where: { user: { id: me.id } },
      });

      if (partner && product.assignedPartner?.id === partner.id) return true;
    }

    return false;
  }
}
