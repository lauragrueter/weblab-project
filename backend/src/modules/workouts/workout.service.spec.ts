import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutsService } from './workouts.service.js';
import { Workout } from './entities/workout.entity.js';
import { CategoriesService } from '../categories/categories.service.js';
import { Category } from '../categories/entities/categories.entity.js';

type MockedRepository<T extends { id: string }> = {
  find: Mock;
  findOne: Mock;
  create: Mock;
  save: Mock;
  merge: Mock;
  remove: Mock;
};

type MockedCategoriesService = {
  findOne: Mock;
};

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let workoutRepository: MockedRepository<Workout>;
  let categoriesService: MockedCategoriesService;

  const mockCategory: Category = {
    id: 'category-1',
    name: 'Cardio',
  } as Category;

  const mockWorkout: Workout = {
    id: 'workout-1',
    name: 'Morning Run',
    date: '2024-01-01',
    duration: 30,
    category: mockCategory,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutsService,
        {
          provide: getRepositoryToken(Workout),
          useValue: {
            find: vi.fn(),
            findOne: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            merge: vi.fn(),
            remove: vi.fn(),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            findOne: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(WorkoutsService);
    workoutRepository = module.get(getRepositoryToken(Workout));
    categoriesService = module.get(CategoriesService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all workouts ordered by date desc', async () => {
      workoutRepository.find.mockResolvedValue([mockWorkout]);

      const result = await service.findAll();

      expect(result).toEqual([mockWorkout]);
      expect(workoutRepository.find).toHaveBeenCalledWith({
        relations: { category: true },
        order: { date: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a workout when found', async () => {
      workoutRepository.findOne.mockResolvedValue(mockWorkout);

      const result = await service.findOne('workout-1');

      expect(result).toEqual(mockWorkout);
      expect(workoutRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'workout-1' },
        relations: { category: true },
      });
    });

    it('should throw NotFoundException when workout does not exist', async () => {
      workoutRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a workout with a valid category', async () => {
      const dto = {
        name: 'Morning Run',
        date: new Date(),
        categoryId: 'category-1',
      };

      categoriesService.findOne.mockResolvedValue(mockCategory);
      workoutRepository.create.mockReturnValue(mockWorkout);
      workoutRepository.save.mockResolvedValue(mockWorkout);
      workoutRepository.findOne.mockResolvedValue(mockWorkout);

      const result = await service.create(dto as any);

      expect(categoriesService.findOne).toHaveBeenCalledWith('category-1');
      expect(workoutRepository.create).toHaveBeenCalledWith({
        name: 'Morning Run',
        date: dto.date,
        category: mockCategory,
      });
      expect(workoutRepository.save).toHaveBeenCalledWith(mockWorkout);
      expect(result).toEqual(mockWorkout);
    });

    it('should create a workout without a category when categoryId is not provided', async () => {
      const dto = { name: 'Morning Run', date: new Date() };

      workoutRepository.create.mockReturnValue(mockWorkout);
      workoutRepository.save.mockResolvedValue(mockWorkout);
      workoutRepository.findOne.mockResolvedValue(mockWorkout);

      await service.create(dto as any);

      expect(categoriesService.findOne).not.toHaveBeenCalled();
      expect(workoutRepository.create).toHaveBeenCalledWith({
        name: 'Morning Run',
        date: dto.date,
        category: undefined,
      });
    });

    it('should throw NotFoundException when categoryId does not exist', async () => {
      const dto = {
        name: 'Morning Run',
        date: new Date(),
        categoryId: 'invalid-id',
      };

      categoriesService.findOne.mockRejectedValue(
        new NotFoundException('No category found with ID invalid-id'),
      );

      await expect(service.create(dto as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(workoutRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a workout without changing the category', async () => {
      const dto = { name: 'Evening Run' };

      workoutRepository.findOne
        .mockResolvedValueOnce(mockWorkout) // findOne innerhalb von update
        .mockResolvedValueOnce({ ...mockWorkout, name: 'Evening Run' }); // finaler findOne
      workoutRepository.merge.mockImplementation((target: any, source: any) =>
        Object.assign(target, source),
      );
      workoutRepository.save.mockResolvedValue(mockWorkout);

      const result = await service.update('workout-1', dto as any);

      expect(categoriesService.findOne).not.toHaveBeenCalled();
      expect(workoutRepository.merge).toHaveBeenCalledWith(mockWorkout, {
        name: 'Evening Run',
      });
      expect(result.name).toEqual('Evening Run');
    });

    it('should update the category when a valid categoryId is provided', async () => {
      const newCategory = { id: 'category-2', name: 'Strength' } as Category;
      const dto = { categoryId: 'category-2' };

      workoutRepository.findOne
        .mockResolvedValueOnce(mockWorkout)
        .mockResolvedValueOnce({ ...mockWorkout, category: newCategory });
      categoriesService.findOne.mockResolvedValue(newCategory);
      workoutRepository.merge.mockImplementation((target: any, source: any) =>
        Object.assign(target, source),
      );
      workoutRepository.save.mockResolvedValue(mockWorkout);

      await service.update('workout-1', dto as any);

      expect(categoriesService.findOne).toHaveBeenCalledWith('category-2');
      expect(workoutRepository.merge).toHaveBeenCalledWith(mockWorkout, {
        category: newCategory,
      });
    });

    it('should throw NotFoundException when the workout does not exist', async () => {
      workoutRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing-id', { name: 'x' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when the new categoryId does not exist', async () => {
      workoutRepository.findOne.mockResolvedValueOnce(mockWorkout);
      categoriesService.findOne.mockRejectedValue(
        new NotFoundException('No category found with ID invalid-id'),
      );

      await expect(
        service.update('workout-1', { categoryId: 'invalid-id' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(workoutRepository.merge).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an existing workout', async () => {
      workoutRepository.findOne.mockResolvedValue(mockWorkout);
      workoutRepository.remove.mockResolvedValue(mockWorkout);

      await service.remove('workout-1');

      expect(workoutRepository.remove).toHaveBeenCalledWith(mockWorkout);
    });

    it('should throw NotFoundException when the workout does not exist', async () => {
      workoutRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(workoutRepository.remove).not.toHaveBeenCalled();
    });
  });
});
