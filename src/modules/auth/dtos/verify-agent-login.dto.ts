import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyAgentLoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrPhone: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;
}
