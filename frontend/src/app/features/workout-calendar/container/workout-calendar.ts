import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { WorkoutService } from '../../workouts/services/workout.service';
import { toDateKey, parseBackendDate } from '../../../shared/utils/date.utils';
import { FitLogActionToolbar } from '../../../shared/components/action-toolbar/action-toolbar';
import { FitLogPageHeader } from '../../../shared/components/page-header/page-header';
import { CalendarView } from '../components/calendar-view/calendar-view';

@Component({
  selector: 'fitlog-workout-calendar',
  imports: [FitLogActionToolbar, FitLogPageHeader, CalendarView],
  template: `
    <div class="calendar-page">
      <fitlog-page-header title="Workouts" subtitle="Kalender"></fitlog-page-header>
      <fitlog-action-toolbar></fitlog-action-toolbar>

      <fitlog-calendar-view
        [selectedDate]="selectedDate()"
        [dateClass]="dateClass"
        [workoutsOnSelectedDate]="workoutsOnSelectedDate()"
        (selectedChange)="onSelectedChange($event)"
      />
    </div>
  `,
  styleUrl: './workout-calendar.css',
})
export class WorkoutCalendar implements OnInit {
  private workoutService = inject(WorkoutService);

  selectedDate = signal<Date>(new Date());

  private workoutDates = computed(() => {
    const dates = new Set<string>();
    for (const w of this.workoutService.workouts()) {
      const parsed = parseBackendDate(w.date);
      if (parsed) dates.add(toDateKey(parsed));
    }
    return dates;
  });

  workoutsOnSelectedDate = computed(() => {
    const key = toDateKey(this.selectedDate());
    return this.workoutService.workouts().filter((w) => {
      const parsed = parseBackendDate(w.date);
      return parsed ? toDateKey(parsed) === key : false;
    });
  });

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view !== 'month') return '';
    return this.workoutDates().has(toDateKey(cellDate)) ? 'has-workout' : '';
  };

  ngOnInit(): void {
    this.workoutService.loadWorkouts();
  }

  onSelectedChange(date: Date | null): void {
    if (date) this.selectedDate.set(date);
  }
}
