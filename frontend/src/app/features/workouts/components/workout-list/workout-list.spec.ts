import { describe, it, expect } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WorkoutList } from './workout-list';
import { FitLogTable } from '../../../../shared/components/table/table';

describe('WorkoutListComponent', () => {
  let fixture: ComponentFixture<WorkoutList>;
  let component: WorkoutList;

  const mockWorkout = { id: '1', name: 'Running', duration: 30, date: '2024-01-15' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutList],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('workouts', [mockWorkout]);
    fixture.detectChanges();
  });

  it('passes workouts and loading down to the table', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(FitLogTable)).componentInstance;
    expect(table.items()).toEqual([mockWorkout]);
    expect(table.loading()).toBe(true);
  });

  it('emits delete with the workout when the table emits delete', () => {
    let emitted: string | undefined;
    component.delete.subscribe((id) => (emitted = id));

    const table = fixture.debugElement.query(By.directive(FitLogTable)).componentInstance;
    table.delete.emit(mockWorkout);

    expect(emitted).toBe('1');
  });

  it('emits edit when the table emits edit', () => {
    let emitted: typeof mockWorkout | undefined;
    component.edit.subscribe((w) => (emitted = w));

    const table = fixture.debugElement.query(By.directive(FitLogTable)).componentInstance;
    table.edit.emit(mockWorkout);

    expect(emitted).toEqual(mockWorkout);
  });

  describe('columns', () => {
    it('formats a valid date', () => {
      const dateCol = component.columns.find((c) => c.key === 'date')!;
      expect(dateCol.value(mockWorkout)).toBe('15.01.2024');
    });

    it('shows "–" for an invalid or missing date', () => {
      const dateCol = component.columns.find((c) => c.key === 'date')!;
      expect(dateCol.value({ ...mockWorkout, date: null as any })).toBe('–');
    });

    it('shows "-" when no category is present', () => {
      const catCol = component.columns.find((c) => c.key === 'category')!;
      expect(catCol.value(mockWorkout)).toBe('-');
    });

    it('shows the category name when present', () => {
      const catCol = component.columns.find((c) => c.key === 'category')!;
      expect(catCol.value({ ...mockWorkout, category: { name: 'Cardio' } } as any)).toBe('Cardio');
    });
  });

  describe('workoutSearchFn', () => {
    it('matches case-insensitively', () => {
      expect(component.workoutSearchFn(mockWorkout, 'run')).toBe(true);
      expect(component.workoutSearchFn(mockWorkout, 'RUN')).toBe(true);
      expect(component.workoutSearchFn(mockWorkout, 'swim')).toBe(false);
    });
  });
});
