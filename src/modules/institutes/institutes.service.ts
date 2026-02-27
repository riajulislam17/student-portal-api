import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstituteDTO } from './dto/create-institute.dto';
import { UpdateInstituteDTO } from './dto/update-institute.dto';
import { getOffsetPagination } from 'src/common/pagination/pagination';
import { InjectModel } from '@nestjs/sequelize';
import { Institute } from 'models/institute.model';
import { slugify } from 'src/common/utils/slugify';
import { Op } from 'sequelize';

@Injectable()
export class InstitutesService {
  constructor(
    @InjectModel(Institute) private readonly institute: typeof Institute,
  ) {}

  async create(dto: CreateInstituteDTO) {
    const baseSlug = slugify(dto.name);
    let slug = baseSlug;

    let count = 1;
    while (await this.institute.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    return this.institute.create({ ...dto, slug } as any);
  }

  async findAll(page?: number, limit?: number) {
    const pagination = getOffsetPagination(page, limit);

    const { rows, count } = await this.institute.findAndCountAll({
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
    const item = await this.institute.findByPk(id);
    if (!item) throw new NotFoundException('Institute not found');
    return item;
  }

  async update(id: number, dto: UpdateInstituteDTO) {
    const item = await this.findOne(id);

    const payload: any = { ...dto };

    if (dto.name) {
      const baseSlug = slugify(dto.name);
      let slug = baseSlug;
      let count = 1;

      while (
        await this.institute.findOne({
          where: { slug, id: { [Op.ne]: id } },
        })
      ) {
        slug = `${baseSlug}-${count++}`;
      }

      payload.slug = slug;
    }

    await item.update(payload);
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return;
  }
}
