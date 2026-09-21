import 'dotenv/config';
import { Module } from '@nestjs/common';
import { WorkoutsModule } from './modules/workouts/workouts.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './modules/workouts/entities/workout.entity.js';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { Category } from './modules/categories/entities/categories.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Workout, Category],
      autoLoadEntities: true,
      synchronize: true, //für dev
    }),
    WorkoutsModule,
    CategoriesModule,
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
