import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WorkoutsModule } from './modules/workouts/workouts.module.js';

@Module({
  imports: [WorkoutsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
