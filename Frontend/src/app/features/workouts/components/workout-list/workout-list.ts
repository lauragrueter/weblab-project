import { Component, computed, inject, signal, OnInit, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutFormDialogComponent } from '../workout-form-dialog/workout-form-dialog';
import { Workout } from '../../models/workout.models';


@Component({
  selector: 'workout-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatIconButton,
    MatPaginatorModule
  ],
  templateUrl: './workout-list.html',
  styleUrls: ['./workout-list.css'],
})
export class WorkoutListComponent implements OnInit {
  private workoutService = inject(WorkoutService);
  private dialog = inject(MatDialog);

  paginator = viewChild(MatPaginator);
  dataSource = new MatTableDataSource<Workout>([]);

  displayedColumns: string[] = ['date', 'duration', 'name', 'actions'];
  searchTerm = signal('');

  filteredWorkouts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allWorkouts = this.workoutService.workouts();

    if (!term) return allWorkouts;

    return allWorkouts.filter((w) => w.name.toLowerCase().includes(term));
  });

  private syncPaginatorEffect = effect(() => {
    this.dataSource.data = this.filteredWorkouts();
    const paginatorRef = this.paginator();
    if (paginatorRef) {
      this.dataSource.paginator = paginatorRef;
    }
  });

  ngOnInit(): void {
    this.workoutService.loadWorkouts();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  editWorkout(workout: Workout): void {
    const dialogRef = this.dialog.open(WorkoutFormDialogComponent, {
      width: '400px', //TODO keine fixe grösse
      data: { workout },
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
