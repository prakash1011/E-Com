import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Users } from 'src/components/user/user.entities';
import { Roles } from 'src/roleEntity/roles.entities';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Roles)
    private readonly rolesRepo: Repository<Roles>,
  ) {}

  async create(dto: CreateCustomerDto) {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email already exists');

    const role = await this.rolesRepo.findOne({
      where: { roleName: 'customer' },
    });
    if (!role) throw new BadRequestException('Role customer not found');

    const user = this.usersRepo.create({
      email: dto.email,
      password: dto.password,
      roles: role,
      active: 1,
    });

    const saved = await this.usersRepo.save(user);
    const { password, ...rest } = saved;
    return rest;
  }
}
