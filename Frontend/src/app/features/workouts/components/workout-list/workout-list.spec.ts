import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { WorkoutListComponent } from './workout-list';
import { WorkoutService } from '../../services/workout.service';

describe('WorkoutListComponent', () => {
  let fixture: ComponentFixture<WorkoutListComponent>;
  let component: WorkoutListComponent;
  let workoutService: {
    workouts: ReturnType<typeof signal>;
    loadWorkouts: ReturnType<typeof vi.fn>;
    updateWorkout: ReturnType<typeof vi.fn>;
    deleteWorkout: ReturnType<typeof vi.fn>;
  };
  let dialog: { open: ReturnType<typeof vi.fn> };

  const mockWorkout = { id: '1', name: 'Running', duration: 30, date: '2024-01-15' };

  beforeEach(async () => {
    workoutService = {
      workouts: signal([mockWorkout]),
      loadWorkouts: vi.fn(),
      updateWorkout: vi.fn(),
      deleteWorkout: vi.fn(),
    };
    dialog = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent],
      providers: [
        { provide: WorkoutService, useValue: workoutService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load workouts on initialization', () => {
    expect(workoutService.loadWorkouts).toHaveBeenCalled();
  });

  it('should call deleteWorkout with the correct id', () => {
    component.deleteWorkout(mockWorkout.id);
    expect(workoutService.deleteWorkout).toHaveBeenCalledWith('1');
  });

  it('should open the dialog and update the workout upon confirmation', () => {
    const updatedWorkout = { ...mockWorkout, name: 'Swimming' };
    dialog.open.mockReturnValue({
      afterClosed: () => of(updatedWorkout),
    });

    component.editWorkout(mockWorkout);

    expect(dialog.open).toHaveBeenCalled();
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
});