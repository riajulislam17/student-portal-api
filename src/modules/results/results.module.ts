import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Result } from 'models/result.model';

@Module({
  imports: [SequelizeModule.forFeature([Result])],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
