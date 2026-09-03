import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity.js';
import { CreateWorkoutDto } from './dto/create-workout.dto.js';
import { UpdateWorkoutDto } from './dto/update-workout.dto.js';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
  ) {}

  findAll(): Promise<Workout[]> {
    return this.workoutRepository.find({ order: { date: 'DESC' } });
  }

  async findOne(id: string): Promise<Workout> {
    const workout = await this.workoutRepository.findOneBy({ id });
    if (!workout) {
      throw new NotFoundException(`No workout found with ID ${id}`);
    }
    return workout;
  }

  create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const workout = this.workoutRepository.create(createWorkoutDto);
    return this.workoutRepository.save(workout);
  }

  async update(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<Workout> {
    const workout = await this.findOne(id);
    this.workoutRepository.merge(workout, updateWorkoutDto);
    return this.workoutRepository.save(workout);
  }

  async remove(id: string): Promise<void> {
    const workout = await this.findOne(id);
    await this.workoutRepository.remove(workout);
  }
}