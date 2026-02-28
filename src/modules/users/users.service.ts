import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { getOffsetPagination } from 'src/common/pagination/pagination';
import * as bcrypt from 'bcrypt';
import { User } from 'models/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly user: typeof User) {}

  async create(dto: CreateUserDTO) {
    const exists = await this.user.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');
    const hash = await bcrypt.hash(dto.password, 10);
    const u = await this.user.create({
      name: dto.name,
      email: dto.email,
      password: hash,
      role: dto.role,
    } as User);
    return {
      id: u.id,
      email: u.email,
      role: u.role,
    };
  }

  async findAll(page?: number, limit?: number) {
    const pagination = getOffsetPagination(page, limit);
    const { rows, count } = await this.user.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      order: [['id', 'DESC']],
    });

    return {
      page: pagination.page,
      limit: pagination.limit,
      total: count,
      data: rows.map((r) => {
        const user = r.toJSON();
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }),
    };
  }

  async findOne(id: number) {
    const r = await this.user.findByPk(id);
    if (!r) throw new NotFoundException('User not found');

    return {
      id: r.id,
      email: r.email,
      role: r.role,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async update(id: number, dto: UpdateUserDTO) {
    const r = await this.user.findByPk(id);
    if (!r) throw new NotFoundException('User not found');

    const patch: any = { ...dto };
    if (dto.password) patch.password = await bcrypt.hash(dto.password, 10);
    await r.update(patch);

    return {
      id: r.id,
      email: r.email,
      role: r.role,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async remove(id: number) {
    const r = await this.user.findByPk(id);
    if (!r) throw new NotFoundException('User not found');

    await r.destroy();
    return;
  }
}
