import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyAdminLoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrPhone: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;
}
