
 import { IsNotEmpty, IsString } from 'class-validator';
 
 export class CreateNoticeDto {
     @IsNotEmpty()
     @IsString()
     notice: string;
     
 }
 