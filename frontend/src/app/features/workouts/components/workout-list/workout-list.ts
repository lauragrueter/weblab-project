import { Component, input, output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FitLogTable, ColumnDef } from '../../../../shared/components/table/table';
import { Workout } from '../../models/workout.model';
import { parseBackendDate } from '../../../../shared/utils/date.utils';

@Component({
  selector: 'fitlog-workout-list',
  imports: [CommonModule, FitLogTable],
  template: `
    <fitlog-table
      [items]="workouts()"
      [columns]="columns"
      [loading]="loading()"
      searchPlaceholder="Workouts durchsuchen"
      [searchFn]="workoutSearchFn"
      (edit)="edit.emit($event)"
      (delete)="delete.emit($event.id)"
    />
  `,
})
export class WorkoutList {
  workouts = input.required<Workout[]>();
  loading = input(false);

  edit = output<Workout>();
  delete = output<string>();

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
    { key: 'category', header: 'Kategorie', value: (w) => w.category?.name ?? '-' },
  ];

  workoutSearchFn = (w: Workout, term: string) => w.name.toLowerCase().includes(term.toLowerCase());
}
