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
import { CoursesService } from './courses.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles("super_admin", "admin", "institute_admin")
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post() create(@Body() dto: CreateCourseDTO) {
    return this.coursesService.create(dto);
  }
  @Get() findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.coursesService.findAll(Number(page), Number(limit));
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.coursesService.findOne(Number(id));
  }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateCourseDTO) {
    return this.coursesService.update(Number(id), dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.coursesService.remove(Number(id));
  }
}
