import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './email.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('EMAIL_HOST'),
      port: this.config.get<number>('EMAIL_PORT') ?? 465,
      secure: true,
      auth: {
        user: this.config.get<string>('EMAIL_USERNAME'),
        pass: this.config.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(dto: SendEmailDto) {
    const { recipients, subject, html, text } = dto;

    const options: nodemailer.SendMailOptions = {
      from:
        this.config.get<string>('EMAIL_FROM') ??
        this.config.get<string>('EMAIL_USERNAME'),
      to: recipients,
      subject,
      html,
      text,
    };

    const info = await this.transporter.sendMail(options);
    // Helpful logging
    console.log('Message sent:', info.messageId, info.response);
    // console.log('Accepted:', info.accepted, 'Rejected:', info.rejected);

    // If nothing was accepted, treat as failure
    if (!info.accepted || info.accepted.length === 0) {
      throw new Error('SMTP accepted no recipients');
    }

    return info;
  }
}
