import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../models/category.model';

@Component({
  selector: 'category-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  styleUrl: './category-form-dialog.css',
  templateUrl: './category-form-dialog.html',
})
export class CategoryFormDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryFormDialog>);
  public data = inject<{ category?: Category }>(MAT_DIALOG_DATA);

  isEditMode = false;
  categoryForm!: FormGroup;

  ngOnInit(): void {
    const category = this.data?.category;
    this.isEditMode = !!category;

    this.categoryForm = this.fb.group({
      id: [category?.id ?? null],
      name: [category?.name ?? '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const raw = this.categoryForm.value;
      const result: CreateCategoryDto | UpdateCategoryDto = {
        name: raw.name,
      };
      this.dialogRef.close(this.isEditMode ? { id: raw.id, ...result } : result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
