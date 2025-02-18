
 import { IsOptional, IsString } from "class-validator";
 import { QueryDto } from "src/common/dtos/query.dto";
 
 export class QueryOtpDto extends QueryDto {
   @IsOptional()
   @IsString()
   search?: string;
 }
 