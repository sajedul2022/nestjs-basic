import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SmtpService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // Set to true for 465, false for other ports (TLS)
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    text: string = '',
    cc: string = '',
  ) {
    const from = {
      name: this.configService.get<string>('SMTP_FROM_NAME'),
      address: this.configService.get<string>('SMTP_FROM_EMAIL'),
    };

    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
      cc,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      //   throw error;
    }
  }
}
