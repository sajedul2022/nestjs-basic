import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from '../../../common/enums/user.enums';
import { OTP_TYPE } from '../enums/otp.enum';

export class CreateOtpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsNumber()
  code: number;

  @IsNotEmpty()
  @IsEnum(OTP_TYPE)
  type: OTP_TYPE;

  @IsNotEmpty()
  @IsEnum(UserType)
  userType: UserType;
}
