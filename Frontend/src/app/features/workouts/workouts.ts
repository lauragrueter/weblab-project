import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WorkoutService } from './services/workout.service';
import { WorkoutFormDialogComponent } from './components/workout-form-dialog/workout-form-dialog';
import { WorkoutListComponent } from './components/workout-list/workout-list';
import { Workout } from './models/workout.models';
import { MatIconModule } from '@angular/material/icon';
import { FitLogCreateButton } from '../../shared/components/create-button/create-button';
import { FitLogPageHeader } from '../../shared/components/page-header/page-header';
import { FitLogActionToolbar } from '../../shared/components/action-toolbar/action-toolbar';

@Component({
  selector: 'app-workouts',
  imports: [
    MatButtonModule,
    WorkoutListComponent, 
    MatIconModule, 
    FitLogCreateButton, 
    FitLogPageHeader, 
    FitLogActionToolbar
  ],
  templateUrl: './workouts.html',
  styleUrl: './workouts.css',
})
export class WorkoutsComponent {
  protected workoutService = inject(WorkoutService);
  private dialog = inject(MatDialog);

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(WorkoutFormDialogComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((formData: Workout | undefined) => {
      if (formData) {
        this.workoutService.createWorkout(formData);
      }
    });
  }
}