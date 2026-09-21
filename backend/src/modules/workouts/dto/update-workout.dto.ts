import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutDto } from './create-workout.dto.js';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {}
