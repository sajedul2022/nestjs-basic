import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyAgentRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;
}
