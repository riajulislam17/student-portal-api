import { IsOptional, IsString } from 'class-validator';

export class CreateInstituteDTO {
  @IsString() name: string;

  @IsString() email?: string;

  @IsString() phone: string;

  @IsOptional() @IsString() address?: string;
}
