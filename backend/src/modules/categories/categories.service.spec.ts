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
import { CategoriesService } from './categories.service.js';
import { Category } from './entities/categories.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

type MockedRepository = {
  find: Mock;
  findOneBy: Mock;
  create: Mock;
  save: Mock;
  merge: Mock;
  remove: Mock;
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: MockedRepository;

  const mockCategory: Category = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Cardio',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: vi.fn(),
            findOneBy: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            merge: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CategoriesService);
    categoryRepository = module.get(getRepositoryToken(Category));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all categories ordered by name asc', async () => {
      categoryRepository.find.mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(result).toEqual([mockCategory]);
      expect(categoryRepository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a category when found', async () => {
      categoryRepository.findOneBy.mockResolvedValue(mockCategory);

      const result = await service.findOne(mockCategory.id);

      expect(result).toEqual(mockCategory);
      expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCategory.id,
      });
    });

    it('should throw NotFoundException when category does not exist', async () => {
      categoryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and save a new category', async () => {
      const dto: CreateCategoryDto = { name: 'Strength' };

      categoryRepository.create.mockReturnValue(mockCategory);
      categoryRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(dto);

      expect(categoryRepository.create).toHaveBeenCalledWith(dto);
      expect(categoryRepository.save).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const dto: UpdateCategoryDto = { name: 'Strength Training' };
      const updatedCategory = { ...mockCategory, name: 'Strength Training' };

      categoryRepository.findOneBy.mockResolvedValue(mockCategory);
      categoryRepository.merge.mockImplementation((target: any, source: any) =>
        Object.assign(target, source),
      );
      categoryRepository.save.mockResolvedValue(updatedCategory);

      const result = await service.update(mockCategory.id, dto);

      expect(categoryRepository.merge).toHaveBeenCalledWith(mockCategory, dto);
      expect(categoryRepository.save).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException when the category to update does not exist', async () => {
      categoryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('missing-id', { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
      expect(categoryRepository.merge).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an existing category', async () => {
      categoryRepository.findOneBy.mockResolvedValue(mockCategory);
      categoryRepository.remove.mockResolvedValue(mockCategory);

      await service.remove(mockCategory.id);

      expect(categoryRepository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException when the category to remove does not exist', async () => {
      categoryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(categoryRepository.remove).not.toHaveBeenCalled();
    });
  });
});
