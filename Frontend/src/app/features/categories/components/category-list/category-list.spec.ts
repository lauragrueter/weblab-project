import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { CategoryList } from './category-list';
import { CategoryService } from '../../services/category.service';

describe('CategoryList', () => {
  let fixture: ComponentFixture<CategoryList>;
  let component: CategoryList;
  let categoryService: {
    categories: ReturnType<typeof signal>;
    loadCategories: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    deleteCategory: ReturnType<typeof vi.fn>;
  };
  let dialog: { open: ReturnType<typeof vi.fn> };

  const mockCategory = { id: '1', name: 'Cardio' };

  beforeEach(() => {
    categoryService = {
      categories: signal([mockCategory]),
      loadCategories: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };
    dialog = { open: vi.fn() };

    TestBed.configureTestingModule({
      imports: [CategoryList],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: MatDialog, useValue: dialog },
      ],
    });

    fixture = TestBed.createComponent(CategoryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('categorySearchFn', () => {
    it('matches case-insensitively', () => {
      const c = { name: 'Cardio' } as any;
      expect(component.categorySearchFn(c, 'card')).toBe(true);
      expect(component.categorySearchFn(c, 'CARD')).toBe(true);
      expect(component.categorySearchFn(c, 'kraft')).toBe(false);
    });
  });

  describe('editCategory', () => {
    it('calls updateCategory with the original id and dto without id', () => {
      const formData = { id: 'should-be-stripped', name: 'Zirkeltraining' } as any;
      dialog.open.mockReturnValue({ afterClosed: () => of(formData) });

      component.editCategory(mockCategory);

      expect(categoryService.updateCategory).toHaveBeenCalledWith('1', { name: 'Zirkeltraining' });
    });

    it('does not call updateCategory when the dialog is cancelled', () => {
      dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });

      component.editCategory(mockCategory);

      expect(categoryService.updateCategory).not.toHaveBeenCalled();
    });
  });
});