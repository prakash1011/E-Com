import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from './user.entities';
import { EmailService } from 'src/components/email/email.service';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordService } from 'src/components/reset-password/reset-password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  async sendResetLink(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const token = await this.resetPasswordService.generateResetToken(user);

    const resetLink = `${this.configService.get('RESET_PASSWORD_URL')}?token=${token}`;
    const emailDto = {
      recipients: [user.email],
      subject: 'Password Reset Link',
      html: `
        <h3>Password Reset Request</h3>
        <p>Click below to reset your password (valid for 15 minutes):</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
      `,
    };

    await this.emailService.sendEmail(emailDto);
    return { message: 'Password reset link sent successfully.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.resetPasswordService.validateResetToken(token);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Invalid user.');
    // assign the new password so @BeforeUpdate hashes it
    user.password = newPassword;
    await this.userRepository.save(user);
    return { message: 'Password has been reset successfully.' };
  }

  async getAllUsers(withDeleted = false) {
    return this.userRepository.find({
      relations: ['partner', 'roles'],
      withDeleted,
      order: { createdAt: 'ASC' },
    });
  }
}
