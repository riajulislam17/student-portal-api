import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { getOffsetPagination } from 'src/common/pagination/pagination';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('institute-student-results')
  instituteStudentResults(
    @Query('instituteId') instituteId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const pagination = getOffsetPagination(Number(page), Number(limit));
    return this.reportsService.instituteStudentResults(
      Number(instituteId),
      pagination.page,
      pagination.limit,
    );
  }

  @Get('top-courses-by-year')
  topCoursesByYear(@Query('year') year?: string, @Query('top') top = '10') {
    const y = year ? Number(year) : new Date().getFullYear();
    return this.reportsService.topCoursesByYear(y, Number(top));
  }

  @Get('top-students')
  topStudents(@Query('top') top = '20') {
    return this.reportsService.topStudents(Number(top));
  }
}
