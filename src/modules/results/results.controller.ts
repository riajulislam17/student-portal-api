import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDTO } from './dto/create-result.dto';
import { UpdateResultDTO } from './dto/update-result.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post() create(@Body() dto: CreateResultDTO) {
    return this.resultsService.create(dto);
  }
  @Get() findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.resultsService.findAll(Number(page), Number(limit));
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.resultsService.findOne(Number(id));
  }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateResultDTO) {
    return this.resultsService.update(Number(id), dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.resultsService.remove(Number(id));
  }
}
