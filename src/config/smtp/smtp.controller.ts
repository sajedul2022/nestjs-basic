import { Body, Controller, Post } from '@nestjs/common';
import { SmtpService } from './smtp.service';

@Controller('smtp')
export class SmtpController {
  constructor(private readonly smtpService: SmtpService) {}

  @Post('send')
  async sendMail(
    @Body()
    body: {
      to: string;
      subject: string;
      html: string;
      text: string;
      cc: string;
    },
  ) {
    return this.smtpService.sendMail(
      body.to,
      body.subject,
      body.html,
      body.text,
      body.cc,
    );
  }
}
