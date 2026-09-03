import { Module } from '@nestjs/common';
import { WorkoutsModule } from './modules/workouts/workouts.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './modules/workouts/entities/workout.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'fitlog_user',
      password: 'fitlog_password',
      database: 'fitlog_db',
      entities: [Workout],
      synchronize: true, // only for dev //TODO deactivate
    }),
    WorkoutsModule,
  ],
})
export class AppModule {}