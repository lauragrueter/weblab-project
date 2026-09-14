import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Workout } from '../../models/workout.models';
import { toDateKey } from '../../../../shared/utils/date.utils';

@Component({
  selector: 'app-workout-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  styleUrl: './workout-form-dialog.css',
  templateUrl: './workout-form-dialog.html',
})
export class WorkoutFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<WorkoutFormDialogComponent>);
  public data = inject<{ workout?: Workout }>(MAT_DIALOG_DATA);

  isEditMode = false;
  workoutForm!: FormGroup;

  ngOnInit(): void {
    const workout = this.data?.workout;
    this.isEditMode = !!workout;

    this.workoutForm = this.fb.group({
      id: [workout?.id ?? null],
      date: [workout?.date ?? new Date(), Validators.required],
      duration: [workout?.duration ?? null, [Validators.required, Validators.min(1)]],
      name: [workout?.name ?? '', Validators.required]
    });
  }

  onSubmit(): void {
  if (this.workoutForm.valid) {
    const raw = this.workoutForm.value;
    const result = {
      ...raw,
      date: toDateKey(raw.date),
    };
    this.dialogRef.close(result);
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }
}
