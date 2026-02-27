import { IsDateString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateResultDTO {
  @Type(() => Number) @IsInt() studentId: number;

  @Type(() => Number) @IsInt() courseId: number;

  @Type(() => Number) @IsInt() instituteId: number;

  @Type(() => Number) @IsNumber() score: number;

  @IsDateString() examDate: string;
}
