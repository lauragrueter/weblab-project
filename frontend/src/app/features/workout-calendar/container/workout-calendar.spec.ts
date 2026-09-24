import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { WorkoutCalendar } from './workout-calendar';
import { WorkoutService } from '../../workouts/services/workout.service';
import { CalendarView } from '../components/calendar-view/calendar-view';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('WorkoutCalendar (container)', () => {
  let fixture: ComponentFixture<WorkoutCalendar>;
  let component: WorkoutCalendar;
  let workoutService: {
    workouts: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal>;
    loadWorkouts: ReturnType<typeof vi.fn>;
  };

  const workoutOn15th = { id: '1', name: 'Running', duration: 30, date: '2024-01-15' };
  const workoutOn20th = { id: '2', name: 'Swimming', duration: 45, date: '2024-01-20' };

  beforeEach(async () => {
    workoutService = {
      workouts: signal([workoutOn15th, workoutOn20th]),
      isLoading: signal(false),
      loadWorkouts: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [WorkoutCalendar],
      providers: [
        { provide: WorkoutService, useValue: workoutService },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load workouts on initialization', () => {
    expect(workoutService.loadWorkouts).toHaveBeenCalled();
  });

  it('should default selectedDate to today', () => {
    const today = new Date();
    const sel = component.selectedDate();
    expect(sel.toDateString()).toBe(today.toDateString());
  });

  it('should update selectedDate on onSelectedChange', () => {
    const newDate = new Date(2024, 0, 20);
    component.onSelectedChange(newDate);
    expect(component.selectedDate()).toBe(newDate);
  });

  it('should ignore a null date in onSelectedChange', () => {
    const before = component.selectedDate();
    component.onSelectedChange(null);
    expect(component.selectedDate()).toBe(before);
  });

  it('should compute workoutsOnSelectedDate for the selected day', () => {
    component.onSelectedChange(new Date(2024, 0, 15));
    expect(component.workoutsOnSelectedDate()).toEqual([workoutOn15th]);
  });

  it('should return an empty array when no workouts match the selected day', () => {
    component.onSelectedChange(new Date(2024, 5, 1));
    expect(component.workoutsOnSelectedDate()).toEqual([]);
  });

  it('should mark dates with workouts via dateClass', () => {
    expect(component.dateClass(new Date(2024, 0, 15), 'month')).toBe('has-workout');
    expect(component.dateClass(new Date(2024, 0, 16), 'month')).toBe('');
  });

  it('should return empty string from dateClass outside month view', () => {
    expect(component.dateClass(new Date(2024, 0, 15), 'year')).toBe('');
  });

  it('should pass selectedDate, dateClass and workoutsOnSelectedDate down to fitlog-calendar-view', () => {
    component.onSelectedChange(new Date(2024, 0, 15));
    fixture.detectChanges();

    const view = fixture.debugElement.query(By.directive(CalendarView)).componentInstance;
    expect(view.selectedDate()).toEqual(new Date(2024, 0, 15));
    expect(view.dateClass()).toBe(component.dateClass);
    expect(view.workoutsOnSelectedDate()).toEqual([workoutOn15th]);
  });

  it('should update selectedDate when fitlog-calendar-view emits selectedChange', () => {
    const view = fixture.debugElement.query(By.directive(CalendarView)).componentInstance;
    const newDate = new Date(2024, 0, 20);

    view.selectedChange.emit(newDate);

    expect(component.selectedDate()).toBe(newDate);
  });
});
