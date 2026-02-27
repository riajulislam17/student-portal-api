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
import { StudentsService } from './students.service';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UpdateStudentDTO } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles("super_admin", "admin", "institute_admin", "institute_staff", "teacher")
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post() create(@Body() dto: CreateStudentDTO) {
    return this.studentsService.create(dto);
  }
  @Get() findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.studentsService.findAll(Number(page), Number(limit));
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateStudentDTO) {
    return this.studentsService.update(Number(id), dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }
}
