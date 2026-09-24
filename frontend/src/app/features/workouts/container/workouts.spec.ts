import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { Workouts } from './workouts';
import { WorkoutService } from '../services/workout.service';
import { WorkoutList } from '../components/workout-list/workout-list';

describe('Workouts (container)', () => {
  let fixture: ComponentFixture<Workouts>;
  let component: Workouts;
  let workoutService: {
    workouts: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal>;
    loadWorkouts: ReturnType<typeof vi.fn>;
    createWorkout: ReturnType<typeof vi.fn>;
    updateWorkout: ReturnType<typeof vi.fn>;
    deleteWorkout: ReturnType<typeof vi.fn>;
  };
  let dialog: { open: ReturnType<typeof vi.fn> };

  const mockWorkout = { id: '1', name: 'Running', duration: 30, date: '2024-01-15' };

  beforeEach(async () => {
    workoutService = {
      workouts: signal([mockWorkout]),
      isLoading: signal(false),
      loadWorkouts: vi.fn(),
      createWorkout: vi.fn(),
      updateWorkout: vi.fn(),
      deleteWorkout: vi.fn(),
    };
    dialog = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Workouts],
      providers: [
        { provide: WorkoutService, useValue: workoutService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Workouts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load workouts on initialization', () => {
    expect(workoutService.loadWorkouts).toHaveBeenCalled();
  });

  it('should pass workouts and loading down to fitlog-workout-list', () => {
    const list = fixture.debugElement.query(By.directive(WorkoutList)).componentInstance;
    expect(list.workouts()).toEqual([mockWorkout]);
    expect(list.loading()).toBe(false);
  });

  it('should open the create dialog and create the workout upon confirmation', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(mockWorkout) });

    component.openCreateDialog();

    expect(dialog.open).toHaveBeenCalled();
    expect(workoutService.createWorkout).toHaveBeenCalledWith(mockWorkout);
  });

  it('should not create a workout when the create dialog is closed without a result', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });

    component.openCreateDialog();

    expect(workoutService.createWorkout).not.toHaveBeenCalled();
  });

  it('should open the dialog and update the workout upon confirmation', () => {
    const updatedWorkout = { ...mockWorkout, name: 'Swimming' };
    dialog.open.mockReturnValue({ afterClosed: () => of(updatedWorkout) });

    component.editWorkout(mockWorkout);

    expect(dialog.open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ data: { workout: mockWorkout } }),
    );
    expect(workoutService.updateWorkout).toHaveBeenCalledWith('1', {
      name: 'Swimming',
      duration: 30,
      date: '2024-01-15',
    });
  });

  it('should not update the workout when the dialog is closed without a result', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });

    component.editWorkout(mockWorkout);

    expect(workoutService.updateWorkout).not.toHaveBeenCalled();
  });

  it('should call deleteWorkout with the correct id', () => {
    component.deleteWorkout(mockWorkout.id);
    expect(workoutService.deleteWorkout).toHaveBeenCalledWith('1');
  });

  it('should trigger editWorkout when fitlog-workout-list emits edit', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });
    const list = fixture.debugElement.query(By.directive(WorkoutList)).componentInstance;

    list.edit.emit(mockWorkout);

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should trigger deleteWorkout when fitlog-workout-list emits delete', () => {
    const list = fixture.debugElement.query(By.directive(WorkoutList)).componentInstance;

    list.delete.emit('1');

    expect(workoutService.deleteWorkout).toHaveBeenCalledWith('1');
  });
});
