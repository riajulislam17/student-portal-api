import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { CreateInstituteDTO } from './dto/create-institute.dto';
import { UpdateInstituteDTO } from './dto/update-institute.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('super_admin', 'admin', 'institute_admin')
@Controller('institutes')
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Post() create(@Body() dto: CreateInstituteDTO) {
    return this.institutesService.create(dto);
  }
  @Get() findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.institutesService.findAll(Number(page), Number(limit));
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.institutesService.findOne(Number(id));
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateInstituteDTO,
  ) {
    return this.institutesService.update(Number(id), dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.institutesService.remove(Number(id));
  }
}
