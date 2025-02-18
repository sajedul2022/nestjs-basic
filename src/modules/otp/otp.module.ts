import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpController } from './controllers/otp.controller';
import { OtpEntity } from './entities/otp.entity';
import { OtpService } from './services/otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
