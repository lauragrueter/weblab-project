import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutFormDialogComponent } from '../workout-form-dialog/workout-form-dialog';
import { Workout } from '../../models/workout.model';
import { FitLogTable, ColumnDef } from '../../../../shared/components/table/table';
import { parseBackendDate } from '../../../../shared/utils/date.utils';

@Component({
  selector: 'workout-list',
  imports: [
    CommonModule,
    FormsModule,
    FitLogTable
  ],
  template: `
    <fitLog-table
      [items]="workoutService.workouts()"
      [columns]="columns"
      searchPlaceholder="Workouts durchsuchen"
      [searchFn]="workoutSearchFn"
      (edit)="editWorkout($event)"
      (delete)="deleteWorkout($event.id)"
    />
  `
})
export class WorkoutListComponent implements OnInit {
  workoutService = inject(WorkoutService);
  private dialog = inject(MatDialog);

  columns: ColumnDef<Workout>[] = [
    {
      key: 'date',
      header: 'Datum',
      value: (w) => {
        const date = parseBackendDate(w.date);
        return date ? formatDate(date, 'dd.MM.yyyy', 'de-CH') : '–';
      },
    },
    { key: 'duration', header: 'Dauer (Min)', value: (w) => `${w.duration} min` },
    { key: 'name', header: 'Beschreibung', value: (w) => w.name },
    { key: 'category', header: 'Kategorie', value: (w) => w.category?.name ?? '-'}
  ];

  workoutSearchFn = (w: Workout, term: string) => w.name.toLowerCase().includes(term);

  ngOnInit(): void {
    this.workoutService.loadWorkouts();
  }

  editWorkout(workout: Workout): void {
    const dialogRef = this.dialog.open(WorkoutFormDialogComponent, {
      width: '25rem',
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