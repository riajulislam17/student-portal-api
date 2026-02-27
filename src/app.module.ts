import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { buildDatabaseConfig } from './common/database/database.config';
import { User } from 'models/user.model';
import { InstitutesModule } from './modules/institutes/institutes.module';
import { StudentsModule } from './modules/students/students.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ResultsModule } from './modules/results/results.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...buildDatabaseConfig(),
        models: [User],
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    InstitutesModule,
    StudentsModule,
    CoursesModule,
    ResultsModule,
    ReportsModule,
  ],
})
export class AppModule {}
