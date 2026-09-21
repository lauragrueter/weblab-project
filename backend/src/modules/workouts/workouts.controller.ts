import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service.js';
import { CreateWorkoutDto } from './dto/create-workout.dto.js';
import { UpdateWorkoutDto } from './dto/update-workout.dto.js';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  findAll() {
    return this.workoutsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.workoutsService.findOne(id);
  }

  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutsService.create(createWorkoutDto);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(id, updateWorkoutDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.workoutsService.remove(id);
  }
}
