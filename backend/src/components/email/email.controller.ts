import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendMail(@Body() dto: SendEmailDto) {
    const info = await this.emailService.sendEmail(dto);
    return { message: 'Email sent', messageId: info.messageId };
  }
}
