import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsMongoId()
  @IsNotEmpty()
  trail: string; 
}