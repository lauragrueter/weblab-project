import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity.js';
import { CreateWorkoutDto } from './dto/create-workout.dto.js';
import { UpdateWorkoutDto } from './dto/update-workout.dto.js';
import { Category } from '../categories/entities/categories.entity.js';
import { CategoriesService } from '../categories/categories.service.js';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    private readonly categoriesService: CategoriesService,
  ) {}

  findAll(): Promise<Workout[]> {
    return this.workoutRepository.find({
      relations: { category: true },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Workout> {
    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!workout) {
      throw new NotFoundException(`No workout found with ID ${id}`);
    }

    return workout;
  }

  async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const { categoryId, ...workoutData } = createWorkoutDto;

    const category = await this.resolveCategory(categoryId);

    const workout = this.workoutRepository.create({
      ...workoutData,
      category,
    });

    const savedWorkout = await this.workoutRepository.save(workout);
    return this.findOne(savedWorkout.id);
  }

  async update(
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<Workout> {
    const { categoryId, ...updateData } = updateWorkoutDto;
    const workout = await this.findOne(id);

    const category =
      categoryId !== undefined
        ? await this.resolveCategory(categoryId)
        : undefined;

    this.workoutRepository.merge(workout, {
      ...updateData,
      ...(category !== undefined && { category }),
    });

    await this.workoutRepository.save(workout);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const workout = await this.findOne(id);
    await this.workoutRepository.remove(workout);
  }

  private async resolveCategory(
    categoryId?: string,
  ): Promise<Category | undefined> {
    if (!categoryId) {
      return undefined;
    }
    return this.categoriesService.findOne(categoryId);
  }
}
