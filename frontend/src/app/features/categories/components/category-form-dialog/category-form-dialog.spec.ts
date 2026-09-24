import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryFormDialog } from './category-form-dialog';

describe('CategoryFormDialog', () => {
  let fixture: ComponentFixture<CategoryFormDialog>;
  let component: CategoryFormDialog;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  const mockCategory = { id: '1', name: 'Cardio' };

  function setup(dialogData: { category?: any } = {}) {
    dialogRef = { close: vi.fn() };

    TestBed.configureTestingModule({
      imports: [CategoryFormDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    });

    fixture = TestBed.createComponent(CategoryFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('ngOnInit – create mode', () => {
    beforeEach(() => setup({}));

    it('sets isEditMode to false', () => {
      expect(component.isEditMode()).toBe(false);
    });

    it('initializes the form with empty defaults', () => {
      expect(component.categoryForm.value).toEqual({ id: null, name: '' });
    });
  });

  describe('ngOnInit – edit mode', () => {
    beforeEach(() => setup({ category: mockCategory }));

    it('sets isEditMode to true', () => {
      expect(component.isEditMode()).toBe(true);
    });

    it('initializes the form with the category values', () => {
      expect(component.categoryForm.value).toEqual({ id: '1', name: 'Cardio' });
    });
  });

  describe('onSubmit', () => {
    it('does not close the dialog when the form is invalid', () => {
      setup({});
      component.onSubmit();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('closes with a create DTO without an id field in create mode', () => {
      setup({});
      component.categoryForm.patchValue({ name: 'Ausdauer' });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({ name: 'Ausdauer' });
    });

    it('closes with the id included in edit mode', () => {
      setup({ category: mockCategory });
      component.categoryForm.patchValue({ name: 'Zirkeltraining' });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({ id: '1', name: 'Zirkeltraining' });
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
