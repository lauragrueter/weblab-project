import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { WorkoutCalendar } from './workout-calendar';
import { WorkoutService } from '../../services/workout.service';

describe('WorkoutCalendar', () => {
  let fixture: ComponentFixture<WorkoutCalendar>;
  let component: WorkoutCalendar;
  let workoutService: { workouts: ReturnType<typeof signal> };

  const workouts = [
    { id: '1', name: 'Running', duration: 30, date: '2024-01-15' },
    { id: '2', name: 'Swimming', duration: 20, date: '2024-01-15' },
    { id: '3', name: 'Cycling', duration: 40, date: '2024-01-20' },
    { id: '4', name: 'Broken', duration: 10, date: 'not-a-date' },
  ];

  function setup(initialWorkouts = workouts) {
    workoutService = { workouts: signal(initialWorkouts) };

    TestBed.configureTestingModule({
      imports: [WorkoutCalendar],
      providers: [
        provideNativeDateAdapter(),
        { provide: WorkoutService, useValue: workoutService },
      ],
    });

    fixture = TestBed.createComponent(WorkoutCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('workoutsOnSelectedDate', () => {
    beforeEach(() => setup());

    it('returns workouts matching the selected date', () => {
      component.selectedDate.set(new Date('2024-01-15'));
      const result = component.workoutsOnSelectedDate();
      expect(result.map((w) => w.id)).toEqual(['1', '2']);
    });

    it('returns an empty list when no workouts match', () => {
      component.selectedDate.set(new Date('2024-02-01'));
      expect(component.workoutsOnSelectedDate()).toEqual([]);
    });

    it('ignores workouts with an unparseable date', () => {
      component.selectedDate.set(new Date('not-a-date'));
      expect(component.workoutsOnSelectedDate()).toEqual([]);
    });
  });

  describe('dateClass', () => {
    beforeEach(() => setup());

    it('returns "has-workout" for a date with workouts in month view', () => {
      const result = component.dateClass(new Date('2024-01-15'), 'month');
      expect(result).toBe('has-workout');
    });

    it('returns an empty string for a date without workouts', () => {
      const result = component.dateClass(new Date('2024-03-01'), 'month');
      expect(result).toBe('');
    });

    it('returns an empty string for non-month views even with a matching date', () => {
      const result = component.dateClass(new Date('2024-01-15'), 'year');
      expect(result).toBe('');
    });
  });

  describe('onSelectedChange', () => {
    beforeEach(() => setup());

    it('updates selectedDate when a date is provided', () => {
      const newDate = new Date('2024-05-01');
      component.onSelectedChange(newDate);
      expect(component.selectedDate()).toBe(newDate);
    });

    it('does not change selectedDate when null is passed', () => {
      const original = component.selectedDate();
      component.onSelectedChange(null);
      expect(component.selectedDate()).toBe(original);
    });
  });
});