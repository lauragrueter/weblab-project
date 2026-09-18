import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { WorkoutService } from '../../services/workout.service';
import { toDateKey, parseBackendDate } from '../../../../shared/utils/date.utils';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FitLogActionToolbar } from '../../../../shared/components/action-toolbar/action-toolbar';
import { FitLogPageHeader } from '../../../../shared/components/page-header/page-header';


@Component({
  selector: 'workout-calendar',
  imports: [
    CommonModule, 
    MatDatepickerModule, 
    MatCardModule, 
    MatListModule,
    MatIconModule,
    FitLogActionToolbar,
    FitLogPageHeader
  ],
  templateUrl: './workout-calendar.html',
  styleUrl: './workout-calendar.css',
})
export class WorkoutCalendar {
  protected workoutService = inject(WorkoutService);

  selectedDate = signal<Date>(new Date());

  private workoutDates = computed(() => {
    const dates = new Set<string>();
    for (const w of this.workoutService.workouts()) {
      const parsed = parseBackendDate(w.date);
      if (parsed) {
        dates.add(toDateKey(parsed));
      }
    }
    return dates;
  });

  workoutsOnSelectedDate = computed(() => {
    const key = toDateKey(this.selectedDate());
    return this.workoutService
      .workouts()
      .filter((w) => {
        const parsed = parseBackendDate(w.date);
        return parsed ? toDateKey(parsed) === key : false;
      });
  });

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view !== 'month') return '';
    return this.workoutDates().has(toDateKey(cellDate)) ? 'has-workout' : '';
  };

  onSelectedChange(date: Date | null): void {
    if (date) {
      this.selectedDate.set(date);
    }
  }
}