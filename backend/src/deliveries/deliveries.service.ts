import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './deliveries.entities';
import { Product } from 'src/product/product.entities';
import { Partner } from 'src/components/partner/partner.entities';
import { Users } from 'src/components/user/user.entities';
import { CreateDeliveryDto } from './createDelivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery) private deliveryRepo: Repository<Delivery>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}

  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepo.find({
      relations: ['assignedPartner', 'product', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Delivery> {
    const d = await this.deliveryRepo.findOne({
      where: { id },
      relations: ['assignedPartner', 'product', 'createdBy'],
    });
    if (!d) throw new NotFoundException('Delivery not found');
    return d;
  }

  async create(dto: CreateDeliveryDto, currentUser?: Users): Promise<Delivery> {
    try {
      console.log('dto', dto);
      const product = await this.productRepo.findOne({
        where: { id: dto.productId },
      });
      if (!product) throw new BadRequestException('Invalid productId');

      let partner: Partner | null = null;
      if (dto.assignedPartnerId) {
        partner = await this.partnerRepo.findOne({
          where: { id: dto.assignedPartnerId },
        });
        if (!partner)
          throw new BadRequestException('Invalid assignedPartnerId');
      }

      const delivery = new Delivery();
      delivery.product = product;
      delivery.assignedPartner = partner ?? null;
      delivery.pickupAddress = dto.pickupAddress;
      delivery.deliveryAddress = dto.deliveryAddress;
      delivery.pickupDate = dto.pickupDate
        ? new Date(dto.pickupDate)
        : new Date();
      delivery.notes = dto.notes ?? null;
      delivery.sender = dto.sender ?? null;
      delivery.receiver = dto.receiver ?? null;
      if (currentUser) {
        delivery.createdBy = currentUser;
      }

      console.log('delivery', delivery);

      const saved = await this.deliveryRepo.save(delivery);
      return this.findOne(saved.id);
    } catch (error) {
      throw new HttpException(
        `${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, dto: any) {
    const delivery = await this.deliveryRepo.findOne({
      where: { id },
    });
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    Object.assign(delivery, dto);
    if (dto.deliveredDate && !dto.deliveryTime) {
      const pickupTime = new Date(delivery.pickupDate).getTime();
      const deliveredTime = new Date(dto.deliveredDate).getTime();
      delivery.deliveryTime = Math.floor(
        (deliveredTime - pickupTime) / (1000 * 60),
      );
    }
    return this.deliveryRepo.save(delivery);
  }
}
