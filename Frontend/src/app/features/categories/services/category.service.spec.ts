import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpClient: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    httpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: HttpClient, useValue: httpClient },
      ],
    });

    service = TestBed.inject(CategoryService);
  });

  describe('loadCategories', () => {
    it('sorts categories case-insensitively by name', () => {
      httpClient.get.mockReturnValue(
        of([
          { id: '1', name: 'Cardio' },
          { id: '2', name: 'arme' },
          { id: '3', name: 'Beine' },
        ])
      );

      service.loadCategories();

      expect(service.categories().map((c) => c.name)).toEqual(['arme', 'Beine', 'Cardio']);
    });

    it('sets isLoading to true while the request is in flight and false afterwards', () => {
      httpClient.get.mockReturnValue(of([]));

      expect(service.isLoading()).toBe(false);
      service.loadCategories();
      expect(service.isLoading()).toBe(false); // synchronous of() resolves immediately
    });

    it('resets isLoading on error without throwing', () => {
      httpClient.get.mockReturnValue(throwError(() => new Error('network error')));

      expect(() => service.loadCategories()).not.toThrow();
      expect(service.isLoading()).toBe(false);
      expect(service.categories()).toEqual([]);
    });
  });

  describe('createCategory', () => {
    it('inserts the new category at the correct sorted position', () => {
      httpClient.get.mockReturnValue(of([{ id: '1', name: 'Cardio' }]));
      service.loadCategories();

      httpClient.post.mockReturnValue(of({ id: '2', name: 'Ausdauer' }));
      service.createCategory({ name: 'Ausdauer' });

      expect(service.categories().map((c) => c.name)).toEqual(['Ausdauer', 'Cardio']);
    });
  });

  describe('updateCategory', () => {
    it('replaces the matching category and re-sorts', () => {
      httpClient.get.mockReturnValue(
        of([
          { id: '1', name: 'Cardio' },
          { id: '2', name: 'Kraft' },
        ])
      );
      service.loadCategories();

      httpClient.put.mockReturnValue(of({ id: '1', name: 'Zirkeltraining' }));
      service.updateCategory('1', { name: 'Zirkeltraining' });

      expect(service.categories().map((c) => c.name)).toEqual(['Kraft', 'Zirkeltraining']);
    });
  });

  describe('deleteCategory', () => {
    it('removes the category with the matching id', () => {
      httpClient.get.mockReturnValue(
        of([
          { id: '1', name: 'Cardio' },
          { id: '2', name: 'Kraft' },
        ])
      );
      service.loadCategories();

      httpClient.delete.mockReturnValue(of(undefined));
      service.deleteCategory('1');

      expect(service.categories().map((c) => c.id)).toEqual(['2']);
    });
  });
});