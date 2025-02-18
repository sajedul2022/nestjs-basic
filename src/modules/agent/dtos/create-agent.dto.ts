import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AGENT_AMOUNT_TYPE } from '../enums/agent-amount.enum';
import { AGENT_ROLE } from '../enums/agent-role.enum';
import { AGENT_STATUS } from '../enums/agent-status.enum';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsEnum(AGENT_AMOUNT_TYPE)
  markuptype?: AGENT_AMOUNT_TYPE;

  @IsOptional()
  @IsNumber()
  markup?: number;

  @IsOptional()
  nid?: string;

  @IsOptional()
  tradelicense?: string;

  @IsOptional()
  civilAviationno?: string;

  @IsOptional()
  acc_key_manager?: string;

  @IsOptional()
  @IsBoolean()
  partialEligibility?: boolean;

  @IsNumber()
  @IsOptional()
  partialEligibilityValue?: number;

  @IsOptional()
  @IsEnum(AGENT_ROLE)
  role?: AGENT_ROLE;

  @IsOptional()
  @IsEnum(AGENT_STATUS)
  status?: AGENT_STATUS;
}

export class CreateAgentByAdminOrAgentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  address?: string;
}
