import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutDialog } from '../workout-dialog/workout-dialog';
import { Workout } from '../../models/workout.models';

@Component({
  selector: 'app-workout-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatIconButton
  ],
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent {
  private workoutService = inject(WorkoutService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['date', 'duration', 'name', 'actions'];

  searchTerm = signal('');

  filteredWorkouts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allWorkouts = this.workoutService.workouts();

    if (!term) return allWorkouts;

    return allWorkouts.filter(w =>
      w.name.toLowerCase().includes(term)
    );
  });

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  editWorkout(workout: Workout): void {
  const dialogRef = this.dialog.open(WorkoutDialog, {
    width: '400px', //TODO keine fixe grösse
    data: { workout }
  });

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