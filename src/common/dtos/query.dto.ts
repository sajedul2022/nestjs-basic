import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  //   @IsNumber()
  perPage?: number;

  @IsOptional()
  //   @IsNumber()
  currentPage?: number;
}
