import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ADMIN_ROLE } from '../enums/admin-role.enum';
import { ADMIN_STATUS } from '../enums/admin-status.enum';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(ADMIN_ROLE)
  role?: ADMIN_ROLE;

  @IsOptional()
  @IsEnum(ADMIN_STATUS)
  status?: ADMIN_STATUS;
}
