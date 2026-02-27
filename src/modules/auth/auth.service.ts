import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectModel(User) private readonly users: typeof User,
  ) {}

  async register(dto: RegisterDTO) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({
      name: dto.name,
      email: dto.email,
      password: hash,
      role: dto.role ?? 'student',
    } as any);
    return this.issue(user);
  }

  async login(dto: LoginDTO) {
    const user = await this.users.findOne({ where: { email: dto.email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.dataValues.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.issue(user);
  }

  private issue(user: User) {
    const payload = { userId: user.id, role: user.role };

    const u = user.dataValues;
    return {
      accessToken: this.jwt.sign(payload),
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      },
    };
  }
}
