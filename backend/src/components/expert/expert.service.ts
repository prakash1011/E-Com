import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expert } from './expert.entities';
import { Users } from '../user/user.entities';
import { Repository } from 'typeorm';
import { CreateUserWithExpertDto } from './create-user-with-expert.dto';
import { UpdateUserWithExpertDto } from './update-user-with-expert.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class ExpertService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Expert)
    private readonly expertRepository: Repository<Expert>,
  ) {}

  async createUserWithExpert(dto: CreateUserWithExpertDto) {
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

      const expert = this.expertRepository.create({
        name: dto.expert.name,
        phoneNo: dto.expert.phoneNo,
        address: dto.expert.address,
        notes: dto.expert.notes,
        user: savedUser,
      } as Partial<Expert>);

      const savedExpert = await this.expertRepository.save(expert);

      return {
        user: savedUser,
        expert: savedExpert,
      };
    } catch (err) {
      console.error('error creating expert', err);
      throw new InternalServerErrorException('Failed to create expert');
    }
  }

  async getAllExperts() {
    return this.expertRepository.find({
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getExpertById(id: number) {
    return this.expertRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async updateExpert(id: number, updateDto: UpdateUserWithExpertDto) {
    const expert = await this.expertRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!expert) {
      throw new NotFoundException('Expert not found');
    }

    if (updateDto.expert) {
      expert.name = updateDto.expert.name ?? expert.name;
      expert.phoneNo = updateDto.expert.phoneNo ?? expert.phoneNo;
      expert.address = updateDto.expert.address ?? expert.address;
      expert.notes = updateDto.expert.notes ?? expert.notes;
    }

    if (updateDto.user && expert.user) {
      expert.user.email = updateDto.user.email ?? expert.user.email;

      if (updateDto.user.role_id !== undefined) {
        expert.user.roles = { id: updateDto.user.role_id } as any;
      }

      await this.userRepository.save(expert.user);
    }

    const saved = await this.expertRepository.save(expert);

    return this.expertRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async removeExpert(id: number) {
    const expert = await this.expertRepository.findOne({ where: { id } });
    if (!expert) {
      throw new NotFoundException('Expert not found');
    }

    await this.expertRepository.softDelete(id);

    return { success: true, message: 'Expert soft-deleted' };
  }
}
