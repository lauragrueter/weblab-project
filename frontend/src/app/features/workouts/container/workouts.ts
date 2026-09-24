import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WorkoutService } from '../services/workout.service';
import { WorkoutFormDialog } from '../components/workout-form-dialog/workout-form-dialog';
import { WorkoutList } from '../components/workout-list/workout-list';
import { Workout } from '../models/workout.model';
import { MatIconModule } from '@angular/material/icon';
import { FitLogCreateButton } from '../../../shared/components/create-button/create-button';
import { FitLogPageHeader } from '../../../shared/components/page-header/page-header';
import { FitLogActionToolbar } from '../../../shared/components/action-toolbar/action-toolbar';

@Component({
  selector: 'fitlog-workouts',
  imports: [
    MatButtonModule,
    WorkoutList,
    MatIconModule,
    FitLogCreateButton,
    FitLogPageHeader,
    FitLogActionToolbar,
  ],
  templateUrl: './workouts.html',
  styleUrl: './workouts.css',
})
export class Workouts implements OnInit {
  protected workoutService = inject(WorkoutService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.workoutService.loadWorkouts();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(WorkoutFormDialog, {
      width: '25rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe((formData: Workout | undefined) => {
      if (formData) {
        this.workoutService.createWorkout(formData);
      }
    });
  }

  editWorkout(workout: Workout): void {
    const dialogRef = this.dialog.open(WorkoutFormDialog, { width: '25rem', data: { workout } });
    dialogRef.afterClosed().subscribe((formData: Workout | undefined) => {
      if (formData) {
        const { id, ...dto } = formData;
        this.workoutService.updateWorkout(workout.id, dto);
      }
    });
  }

  deleteWorkout(id: string): void {
    this.workoutService.deleteWorkout(id);
  }
}
