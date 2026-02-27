import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDTO {
  @Type(() => Number) @IsInt() instituteId: number;

  @IsString() name: string;

  @IsString() class: string;

    @IsNumber() roll: number;

  @IsString() section: string;

  @IsOptional() @IsEmail() email?: string | null;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  courseIds: number[];
}
