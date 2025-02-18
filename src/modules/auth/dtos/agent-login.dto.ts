import { IsNotEmpty, IsString } from 'class-validator';

export class AgentLoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrPhone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
