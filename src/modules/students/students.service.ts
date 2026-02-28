import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UpdateStudentDTO } from './dto/update-student.dto';
import { getOffsetPagination } from 'src/common/pagination/pagination';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from 'models/student.model';

@Injectable()
export class StudentsService {
  constructor(@InjectModel(Student) private readonly student: typeof Student) {}

  async create(dto: CreateStudentDTO) {
    return this.student.create(dto as Student);
  }

  async findAll(page?: number, limit?: number) {
    const pagination = getOffsetPagination(page, limit);
    const { rows, count } = await this.student.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      order: [['id', 'DESC']],
    });

    return {
      page: pagination.page,
      limit: pagination.limit,
      total: count,
      data: rows,
    };
  }

  async findOne(id: number) {
    const item = await this.student.findByPk(id);
    if (!item) throw new NotFoundException('student not found');
    return item;
  }

  async update(id: number, dto: UpdateStudentDTO) {
    const item = await this.findOne(id);
    await item.update(dto as Student);
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return;
  }
}
