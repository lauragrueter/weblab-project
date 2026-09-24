import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Workout } from '../../../workouts/models/workout.model';

@Component({
  selector: 'fitlog-calendar-view',
  imports: [CommonModule, MatDatepickerModule, MatCardModule, MatListModule, MatIconModule],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
})
export class CalendarView {
  selectedDate = input.required<Date>();
  dateClass = input.required<MatCalendarCellClassFunction<Date>>();
  workoutsOnSelectedDate = input.required<Workout[]>();

  selectedChange = output<Date | null>();
}
