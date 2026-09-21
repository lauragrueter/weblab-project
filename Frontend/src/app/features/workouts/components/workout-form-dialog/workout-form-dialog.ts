import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CreateWorkoutDto, UpdateWorkoutDto, Workout } from '../../models/workout.model';
import { toDateKey } from '../../../../shared/utils/date.utils';
import { parseBackendDate } from '../../../../shared/utils/date.utils';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../categories/services/category.service';

@Component({
  selector: 'workout-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  styleUrl: './workout-form-dialog.css',
  templateUrl: './workout-form-dialog.html',
})
export class WorkoutFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<WorkoutFormDialogComponent>);
  private categoryService = inject(CategoryService);
  public data = inject<{ workout?: Workout }>(MAT_DIALOG_DATA);

  isEditMode = false;
  workoutForm!: FormGroup;

  categories = this.categoryService.categories;

  ngOnInit(): void {
    const workout = this.data?.workout;
    this.isEditMode = !!workout;

    if (this.categoryService.categories().length === 0) {
      this.categoryService.loadCategories();
    }

    this.workoutForm = this.fb.group({
      id: [workout?.id ?? null],
      date: [parseBackendDate(workout?.date) ?? new Date(), Validators.required],
      duration: [workout?.duration ?? null, [Validators.required, Validators.min(1)]],
      name: [workout?.name ?? '', Validators.required],
      categoryId: [workout?.category?.id ?? null],
    });
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      const raw = this.workoutForm.value;
      const result: CreateWorkoutDto | UpdateWorkoutDto = {
        name: raw.name,
        duration: raw.duration,
        date: toDateKey(raw.date),
        categoryId: raw.categoryId ?? null,
      };
      this.dialogRef.close(this.isEditMode ? { id: raw.id, ...result } : result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
