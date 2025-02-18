import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AGENT_AMOUNT_TYPE } from '../enums/agent-amount.enum';
import { AGENT_STATUS } from '../enums/agent-status.enum';

export class UpdateAgentDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(AGENT_AMOUNT_TYPE)
  markuptype?: AGENT_AMOUNT_TYPE;

  @IsOptional()
  @IsNumber()
  markup?: number;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  nid?: string;

  @IsOptional()
  tradelicense?: string;

  @IsOptional()
  civilAviationNo?: string;

  @IsOptional()
  accKeyManager?: string;

  @IsOptional()
  @IsBoolean()
  partialEligibility?: boolean;

  @IsNumber()
  @IsOptional()
  partialEligibilityValue?: number;

  @IsOptional()
  @IsEnum(AGENT_STATUS)
  status?: AGENT_STATUS;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
