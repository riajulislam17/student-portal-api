import { PartialType } from '@nestjs/mapped-types';
import { CreateResultDTO } from './create-result.dto';

export class UpdateResultDTO extends PartialType(CreateResultDTO) {}
