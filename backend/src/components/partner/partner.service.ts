import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from './partner.entities';
import { Users } from '../user/user.entities';
import { Repository } from 'typeorm';
import { CreateUserWithPartnerDto } from './create-user-with-partner.dto';
import { UpdateUserWithPartnerDto } from './update-user-with-partner.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  async createUserWithPartner(dto: CreateUserWithPartnerDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.user.email },
    });

    if (existingUser) {
      throw new ConflictException('user with this email already exists');
    }

    try {
      const hashed = await bcrypt.hash(dto.user.password, 10);

      const user = this.userRepository.create({
        email: dto.user.email,
        password: dto.user.password,
        roles: { id: dto.user.role_id || 3 },
        active: dto.user.active ?? 1,
      } as Partial<Users>);

      const savedUser = await this.userRepository.save(user);

      const partner = this.partnerRepository.create({
        name: dto.partner.name,
        phoneNo: dto.partner.phoneNo,
        address: dto.partner.address,
        notes: dto.partner.notes,
        user: savedUser,
      } as Partial<Partner>);

      const savedPartner = await this.partnerRepository.save(partner);

      return {
        user: savedUser,
        partner: savedPartner,
      };
    } catch (err) {
      console.error('error creating partner', err);
      throw new InternalServerErrorException('Failed to create partner');
    }
  }

  async getAllPartners() {
    return this.partnerRepository.find({
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getPartnerById(id: number) {
    return this.partnerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async updatePartner(id: number, updateDto: UpdateUserWithPartnerDto) {
    const partner = await this.partnerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    if (updateDto.partner) {
      partner.name = updateDto.partner.name ?? partner.name;
      partner.phoneNo = updateDto.partner.phoneNo ?? partner.phoneNo;
      partner.address = updateDto.partner.address ?? partner.address;
      partner.notes = updateDto.partner.notes ?? partner.notes;
    }

    if (updateDto.user && partner.user) {
      partner.user.email = updateDto.user.email ?? partner.user.email;

      if (updateDto.user.role_id !== undefined) {
        partner.user.roles = { id: updateDto.user.role_id } as any;
      }

      await this.userRepository.save(partner.user);
    }

    const saved = await this.partnerRepository.save(partner);

    return this.partnerRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async removePartner(id: number) {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    await this.partnerRepository.softDelete(id);

    return { success: true, message: 'Partner soft-deleted' };
  }
}
