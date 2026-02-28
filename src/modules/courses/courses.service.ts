import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { getOffsetPagination } from 'src/common/pagination/pagination';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from 'models/course.model';
import { slugify } from 'src/common/utils/slugify';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course) private readonly course: typeof Course) {}

  async create(dto: CreateCourseDTO) {
    const baseSlug = slugify(dto.title);
    let slug = baseSlug;
    let count = 1;

    while (await this.course.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    return this.course.create({
      ...dto,
      slug,
    } as Course);
  }

  async findAll(page?: number, limit?: number) {
    const pagination = getOffsetPagination(page, limit);
    const { rows, count } = await this.course.findAndCountAll({
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
    const item = await this.course.findByPk(id);
    if (!item) throw new NotFoundException('course not found');
    return item;
  }

  async update(id: number, dto: UpdateCourseDTO) {
    const item = await this.findOne(id);
    await item.update(dto as Course);
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return;
  }
}
