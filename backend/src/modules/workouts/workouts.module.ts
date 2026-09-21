import { Module } from '@nestjs/common';
import { WorkoutsController } from './workouts.controller.js';
import { WorkoutsService } from './workouts.service.js';
import { Workout } from './entities/workout.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Workout]), CategoriesModule],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
