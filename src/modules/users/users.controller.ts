import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('super_admin', 'admin', 'institute_admin')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() create(@Body() dto: CreateUserDTO) {
    return this.usersService.create(dto);
  }
  @Get() findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.usersService.findAll(Number(page), Number(limit));
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    return this.usersService.update(Number(id), dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
