import { Module } from '@nestjs/common';
import { WorkoutsController } from './workouts.controller.js';
import { WorkoutsService } from './workouts.service.js';
import { Workout } from './entities/workout.entity.js'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Workout])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}