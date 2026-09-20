// workout.service.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { WorkoutService } from './workout.service';
import { Workout, CreateWorkoutDto, UpdateWorkoutDto } from '../models/workout.model';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let httpMock: HttpTestingController;

  const workoutA: Workout = { id: 'a', name: 'running', duration: 30, date: '2024-01-10' };
  const workoutB: Workout = { id: 'b', name: 'swimming', duration: 45, date: '2024-03-05' };
  const workoutC: Workout = { id: 'c', name: 'hiking', duration: 60, date: '2024-02-15' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WorkoutService);
    httpMock = TestBed.inject(HttpTestingController);

    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('starts with an empty workout list', () => {
      expect(service.workouts()).toEqual([]);
    });

    it('starts with isLoading false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('starts with totalWorkouts at 0', () => {
      expect(service.totalWorkouts()).toBe(0);
    });

    it('starts with totalDurationMinutes at 0', () => {
      expect(service.totalDurationMinutes()).toBe(0);
    });
  });

  describe('loadWorkouts', () => {
    it('sets isLoading to true while the request is in flight', () => {
      service.loadWorkouts();
      expect(service.isLoading()).toBe(true);

      const req = httpMock.expectOne('/api/workouts');
      req.flush([]);
    });

    it('sets isLoading back to false after a successful response', () => {
      service.loadWorkouts();
      const req = httpMock.expectOne('/api/workouts');
      req.flush([]);

      expect(service.isLoading()).toBe(false);
    });

    it('populates workouts with the response data', () => {
      service.loadWorkouts();
      const req = httpMock.expectOne('/api/workouts');
      req.flush([workoutA, workoutB]);

      expect(service.workouts().length).toBe(2);
    });

    it('sorts loaded workouts by date descending (newest first)', () => {
      service.loadWorkouts();
      const req = httpMock.expectOne('/api/workouts');
      req.flush([workoutA, workoutB, workoutC]); // deliberately unsorted input

      expect(service.workouts().map((w) => w.id)).toEqual(['b', 'c', 'a']);
    });

    it('sets isLoading back to false when the request fails', () => {
      service.loadWorkouts();
      const req = httpMock.expectOne('/api/workouts');
      req.flush('error', { status: 500, statusText: 'Server Error' });

      expect(service.isLoading()).toBe(false);
    });

    it('does not modify workouts when the request fails', () => {
      service.loadWorkouts();
      const req = httpMock.expectOne('/api/workouts');
      req.flush('error', { status: 500, statusText: 'Server Error' });

      expect(service.workouts()).toEqual([]);
    });

    it('logs an error when the request fails', () => {
      service.loadWorkouts();
      const req = httpMock.expectOne('/api/workouts');
      req.flush('error', { status: 500, statusText: 'Server Error' });

      expect(console.error).toHaveBeenCalledOnce();
    });
  });

  describe('createWorkout', () => {
    const dto: CreateWorkoutDto = { name: 'running', duration: 30, date: '2024-01-10' };

    it('sends a POST request with the given dto', () => {
      service.createWorkout(dto);

      const req = httpMock.expectOne('/api/workouts');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(workoutA);
    });

    it('adds the created workout to the list', () => {
      service.createWorkout(dto);
      const req = httpMock.expectOne('/api/workouts');
      req.flush(workoutA);

      expect(service.workouts()).toEqual([workoutA]);
    });

    it('inserts the created workout in the correct sorted position', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA, workoutC]); // 01-10, 02-15

      service.createWorkout(dto);
      httpMock.expectOne('/api/workouts').flush(workoutB); // 03-05, should end up first

      expect(service.workouts().map((w) => w.id)).toEqual(['b', 'c', 'a']);
    });

    it('does not change the list when the request fails', () => {
      service.createWorkout(dto);
      const req = httpMock.expectOne('/api/workouts');
      req.flush('error', { status: 500, statusText: 'Server Error' });

      expect(service.workouts()).toEqual([]);
    });

    it('logs an error when the request fails', () => {
      service.createWorkout(dto);
      const req = httpMock.expectOne('/api/workouts');
      req.flush('error', { status: 500, statusText: 'Server Error' });

      expect(console.error).toHaveBeenCalledOnce();
    });
  });

  describe('updateWorkout', () => {
    const dto: UpdateWorkoutDto = { name: 'swimming lake', duration: 60, date: '2024-01-10' };

    it('sends a PUT request to the correct endpoint with the given dto', () => {
      service.updateWorkout('a', dto);

      const req = httpMock.expectOne('/api/workouts/a');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush({ ...workoutA, ...dto });
    });

    it('replaces the matching workout in the list, leaving others untouched', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA, workoutB]);

      const updated = { ...workoutA, name: 'swimming lake', duration: 60 };
      service.updateWorkout('a', dto);
      httpMock.expectOne('/api/workouts/a').flush(updated);

      const result = service.workouts().find((w) => w.id === 'a');
      expect(result).toEqual(updated);
      expect(service.workouts().length).toBe(2);
    });

    it('re-sorts the list if the update changes the date', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA, workoutB]); // a: 01-10, b: 03-05

      const movedWorkout = { ...workoutA, date: '2024-06-01' }; // now newest
      service.updateWorkout('a', dto);
      httpMock.expectOne('/api/workouts/a').flush(movedWorkout);

      expect(service.workouts().map((w) => w.id)).toEqual(['a', 'b']);
    });

    it('does not change the list when the request fails', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA]);

      service.updateWorkout('a', dto);
      httpMock.expectOne('/api/workouts/a').flush('error', { status: 500, statusText: 'Server Error' });

      expect(service.workouts()).toEqual([workoutA]);
    });

    it('logs an error when the request fails', () => {
      service.updateWorkout('a', dto);
      const req = httpMock.expectOne('/api/workouts/a');
      req.flush('error', { status: 500, statusText: 'Server Error' });

      expect(console.error).toHaveBeenCalledOnce();
    });
  });

  describe('deleteWorkout', () => {
    it('sends a DELETE request to the correct endpoint', () => {
      service.deleteWorkout('a');

      const req = httpMock.expectOne('/api/workouts/a');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('removes the matching workout from the list', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA, workoutB]);

      service.deleteWorkout('a');
      httpMock.expectOne('/api/workouts/a').flush(null);

      expect(service.workouts()).toEqual([workoutB]);
    });

    it('does nothing if the id does not match any workout', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA]);

      service.deleteWorkout('does-not-exist');
      httpMock.expectOne('/api/workouts/does-not-exist').flush(null);

      expect(service.workouts()).toEqual([workoutA]);
    });

    it('does not change the list when the request fails', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA]);

      service.deleteWorkout('a');
      httpMock.expectOne('/api/workouts/a').flush('error', { status: 500, statusText: 'Server Error' });

      expect(service.workouts()).toEqual([workoutA]);
    });

    it('logs an error when the request fails', () => {
      service.deleteWorkout('a');
      const req = httpMock.expectOne('/api/workouts/a');
      req.flush('error', { status: 500, statusText: 'Server Error' });

      expect(console.error).toHaveBeenCalledOnce();
    });
  });

  describe('computed signals', () => {
    it('totalWorkouts reflects the current list length', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA, workoutB, workoutC]);

      expect(service.totalWorkouts()).toBe(3);
    });

    it('totalDurationMinutes sums the duration of all workouts', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA, workoutB, workoutC]); // 30 + 45 + 60

      expect(service.totalDurationMinutes()).toBe(135);
    });

    it('totalDurationMinutes updates after a workout is deleted', () => {
      service.loadWorkouts();
      httpMock.expectOne('/api/workouts').flush([workoutA, workoutB]); // 30 + 45

      service.deleteWorkout('a');
      httpMock.expectOne('/api/workouts/a').flush(null);

      expect(service.totalDurationMinutes()).toBe(45);
    });
  });
});