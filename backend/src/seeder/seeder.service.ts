import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/roleEntity/roles.entities';
import { Users } from 'src/components/user/user.entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) {}

  private async insertRoles() {
    try {
      const required = ['admin', 'partner', 'expert', 'customer'];
      const existing = await this.rolesRepository.find();
      const existingNames = existing.map((r) => r.roleName.toLowerCase());
      const missing = required.filter(
        (r) => !existingNames.includes(r.toLowerCase()),
      );

      if (!missing.length) return existing;

      const newRoles = missing.map((roleName) =>
        this.rolesRepository.create({ roleName }),
      );
      return await this.rolesRepository.save(newRoles);
    } catch (error) {
      throw new HttpException(
        'Error inserting roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async insertUser() {
    try {
      const adminRole = await this.rolesRepository.findOne({
        where: { roleName: 'admin' },
      });
      if (!adminRole) throw new Error('Role "admin" not found');

      const existing = await this.usersRepository.findOne({
        where: { email: 'admin@3ts8hlfr.mailosaur.net' },
      });
      if (existing) return existing;

      const admin = this.usersRepository.create({
        email: 'admin@3ts8hlfr.mailosaur.net',
        password: 'Admin@123',
        roles: { id: adminRole.id },
        active: 1,
      });
      return await this.usersRepository.save(admin);
    } catch (error) {
      throw new HttpException(
        'Error creating admin user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async dataBaseSeeder() {
    try {
      const roles = await this.insertRoles();
      const user = await this.insertUser();
      return { roles, user };
    } catch (error) {
      throw new HttpException(
        'Database seeding failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
