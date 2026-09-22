import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { signal } from '@angular/core';
import { WorkoutFormDialog } from './workout-form-dialog';
import { CategoryService } from '../../../categories/services/category.service';

describe('WorkoutFormDialogComponent', () => {
  let fixture: ComponentFixture<WorkoutFormDialog>;
  let component: WorkoutFormDialog;
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let categoryService: {
    categories: ReturnType<typeof signal>;
    loadCategories: ReturnType<typeof vi.fn>;
  };

  const mockWorkout = {
    id: '1',
    name: 'Running',
    duration: 30,
    date: '2024-01-15',
    category: { id: 'cat-1', name: 'Cardio' },
  };

  function setup(dialogData: { workout?: any } = {}) {
    dialogRef = { close: vi.fn() };
    categoryService = {
      categories: signal([]),
      loadCategories: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [WorkoutFormDialog],
      providers: [
        provideNativeDateAdapter(),
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: CategoryService, useValue: categoryService },
      ],
    });

    fixture = TestBed.createComponent(WorkoutFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('ngOnInit – create mode', () => {
    beforeEach(() => setup({}));

    it('sets isEditMode to false', () => {
      expect(component.isEditMode).toBe(false);
    });

    it('initializes the form with empty defaults', () => {
      expect(component.workoutForm.value).toEqual(
        expect.objectContaining({
          id: null,
          duration: null,
          name: '',
          categoryId: null,
        }),
      );
    });

    it('loads categories when none are present', () => {
      expect(categoryService.loadCategories).toHaveBeenCalled();
    });
  });

  describe('ngOnInit – edit mode', () => {
    beforeEach(() => setup({ workout: mockWorkout }));

    it('sets isEditMode to true', () => {
      expect(component.isEditMode).toBe(true);
    });

    it('initializes the form with the workout values', () => {
      expect(component.workoutForm.value).toEqual(
        expect.objectContaining({
          id: '1',
          duration: 30,
          name: 'Running',
          categoryId: 'cat-1',
        }),
      );
    });
  });

  describe('ngOnInit – category loading', () => {
    it('does not reload categories when already present', () => {
      categoryService = {
        categories: signal([{ id: 'cat-1', name: 'Cardio' }]),
        loadCategories: vi.fn(),
      };
      dialogRef = { close: vi.fn() };

      TestBed.configureTestingModule({
        imports: [WorkoutFormDialog],
        providers: [
          provideNativeDateAdapter(),
          { provide: MatDialogRef, useValue: dialogRef },
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: CategoryService, useValue: categoryService },
        ],
      });

      fixture = TestBed.createComponent(WorkoutFormDialog);
      fixture.detectChanges();

      expect(categoryService.loadCategories).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('does not close the dialog when the form is invalid', () => {
      setup({});
      component.onSubmit();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('closes with a create DTO (no id) when valid in create mode', () => {
      setup({});
      component.workoutForm.patchValue({
        date: new Date('2024-01-15'),
        duration: 45,
        name: 'Swimming',
        categoryId: null,
      });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({
        name: 'Swimming',
        duration: 45,
        date: '2024-01-15',
        categoryId: null,
      });
    });

    it('closes with an update DTO including id when valid in edit mode', () => {
      setup({ workout: mockWorkout });
      component.workoutForm.patchValue({ name: 'Updated Run' });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', name: 'Updated Run' }),
      );
    });
  });

  describe('onCancel', () => {
    it('closes the dialog without a result', () => {
      setup({});
      component.onCancel();
      expect(dialogRef.close).toHaveBeenCalledWith();
    });
  });
});
