import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResultDTO } from './dto/create-result.dto';
import { UpdateResultDTO } from './dto/update-result.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Result } from 'models/result.model';
import { getOffsetPagination } from 'src/common/pagination/pagination';

@Injectable()
export class ResultsService {
  constructor(@InjectModel(Result) private readonly result: typeof Result) {}

  async create(dto: CreateResultDTO) {
    return this.result.create({
      studentId: dto.studentId,
      courseId: dto.courseId,
      instituteId: dto.instituteId,
      score: dto.score,
      examDate: new Date(dto.examDate),
    } as any);
  }

  async findAll(page?: number, limit?: number) {
    const pagination = getOffsetPagination(page, limit);
    const { rows, count } = await this.result.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      order: [['id', 'ASC']],
    });

    return {
      page: pagination.page,
      limit: pagination.limit,
      total: count,
      data: rows,
    };
  }

  async findOne(id: number) {
    const item = await this.result.findByPk(id);
    if (!item) throw new NotFoundException('result not found');
    return item;
  }

  async update(id: number, dto: UpdateResultDTO) {
    const item = await this.findOne(id);

    const patch: any = { ...dto };

    if (dto.examDate !== undefined) {
      const d = new Date(dto.examDate);
      if (Number.isNaN(d.getTime())) {
        throw new BadRequestException(
          'Invalid examDate (must be ISO date string)',
        );
      }
      patch.examDate = d;
    }

    await item.update(patch);
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return;
  }
}
