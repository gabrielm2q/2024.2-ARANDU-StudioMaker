import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateContentDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsMongoId()
  trail?: string;

  @IsOptional()
  @IsMongoId()
  journey?: string;
}
