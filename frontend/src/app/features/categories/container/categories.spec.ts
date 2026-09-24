import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { Categories } from './categories';
import { CategoryService } from '../services/category.service';
import { CategoryList } from '../components/category-list/category-list';

describe('Categories (container)', () => {
  let fixture: ComponentFixture<Categories>;
  let component: Categories;
  let categoryService: {
    categories: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal>;
    loadCategories: ReturnType<typeof vi.fn>;
    createCategory: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    deleteCategory: ReturnType<typeof vi.fn>;
  };
  let dialog: { open: ReturnType<typeof vi.fn> };

  const mockCategory = { id: '1', name: 'Cardio' };

  beforeEach(async () => {
    categoryService = {
      categories: signal([mockCategory]),
      isLoading: signal(false),
      loadCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };
    dialog = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Categories],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Categories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load categories on initialization', () => {
    expect(categoryService.loadCategories).toHaveBeenCalled();
  });

  it('should pass categories and loading down to fitlog-category-list', () => {
    const list = fixture.debugElement.query(By.directive(CategoryList)).componentInstance;
    expect(list.categories()).toEqual([mockCategory]);
    expect(list.loading()).toBe(false);
  });

  it('should open the create dialog and create the category upon confirmation', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(mockCategory) });

    component.openCreateDialog();

    expect(dialog.open).toHaveBeenCalled();
    expect(categoryService.createCategory).toHaveBeenCalledWith(mockCategory);
  });

  it('should not create a category when the create dialog is closed without a result', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });

    component.openCreateDialog();

    expect(categoryService.createCategory).not.toHaveBeenCalled();
  });

  it('should open the dialog and update the category upon confirmation', () => {
    const updatedCategory = { ...mockCategory, name: 'Zirkeltraining' };
    dialog.open.mockReturnValue({ afterClosed: () => of(updatedCategory) });

    component.editCategory(mockCategory);

    expect(dialog.open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ data: { category: mockCategory } }),
    );
    expect(categoryService.updateCategory).toHaveBeenCalledWith('1', { name: 'Zirkeltraining' });
  });

  it('should not update the category when the dialog is closed without a result', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });

    component.editCategory(mockCategory);

    expect(categoryService.updateCategory).not.toHaveBeenCalled();
  });

  it('should call deleteCategory with the correct id', () => {
    component.deleteCategory(mockCategory.id);
    expect(categoryService.deleteCategory).toHaveBeenCalledWith('1');
  });

  it('should trigger editCategory when fitlog-category-list emits edit', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });
    const list = fixture.debugElement.query(By.directive(CategoryList)).componentInstance;

    list.edit.emit(mockCategory);

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should trigger deleteCategory when fitlog-category-list emits delete', () => {
    const list = fixture.debugElement.query(By.directive(CategoryList)).componentInstance;

    list.delete.emit('1');

    expect(categoryService.deleteCategory).toHaveBeenCalledWith('1');
  });
});
