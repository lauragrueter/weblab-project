import { Component, inject } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../models/workout.models';
import { WorkoutDialog } from '../workout-dialog/workout-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [
    WorkoutDialog,
    MatButtonModule
  ],
  selector: 'app-workout-create',
  styleUrl: './workout-create.css',
  templateUrl: './workout-create.html',
})
export class WorkoutCreate {
  private workoutService = inject(WorkoutService);
  private dialog = inject(MatDialog);

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(WorkoutDialog, {
      width: '400px', //TODO keine fixe Grösse
      data: {}
    });

    dialogRef.afterClosed().subscribe((formData: Workout | undefined) => {
      if (formData) {
        this.workoutService.createWorkout(formData);
      }
    });
  }

}
