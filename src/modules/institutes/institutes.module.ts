import { Module } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { InstitutesController } from './institutes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Institute } from 'models/institute.model';

@Module({
  imports: [SequelizeModule.forFeature([Institute])],
  controllers: [InstitutesController],
  providers: [InstitutesService],
})
export class InstitutesModule {}
