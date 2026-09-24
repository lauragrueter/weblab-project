import { describe, it, expect } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCalendar } from '@angular/material/datepicker';
import { By } from '@angular/platform-browser';
import { CalendarView } from './calendar-view';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('CalendarView', () => {
  let fixture: ComponentFixture<CalendarView>;
  let component: CalendarView;

  const mockWorkout = { id: '1', name: 'Running', duration: 30, date: '2024-01-15' };
  const noopDateClass = () => '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarView],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarView);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedDate', new Date(2024, 0, 15));
    fixture.componentRef.setInput('dateClass', noopDateClass);
    fixture.componentRef.setInput('workoutsOnSelectedDate', []);
    fixture.detectChanges();
  });

  it('passes selectedDate and dateClass down to mat-calendar', () => {
    const calendar = fixture.debugElement.query(By.directive(MatCalendar)).componentInstance;
    expect(calendar.selected).toEqual(new Date(2024, 0, 15));
    expect(calendar.dateClass).toBe(noopDateClass);
  });

  it('emits selectedChange when mat-calendar emits selectedChange', () => {
    let emitted: Date | null | undefined;
    component.selectedChange.subscribe((d) => (emitted = d));

    const calendar = fixture.debugElement.query(By.directive(MatCalendar)).componentInstance;
    const newDate = new Date(2024, 1, 1);
    calendar.selectedChange.emit(newDate);

    expect(emitted).toEqual(newDate);
  });

  it('shows the empty state when there are no workouts on the selected date', () => {
    const empty = fixture.debugElement.query(By.css('.empty-state'));
    expect(empty).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Keine Workouts an diesem Tag.');
  });

  it('renders a list item for each workout on the selected date', () => {
    fixture.componentRef.setInput('workoutsOnSelectedDate', [mockWorkout]);
    fixture.detectChanges();

    const empty = fixture.debugElement.query(By.css('.empty-state'));
    expect(empty).toBeFalsy();

    const items = fixture.debugElement.queryAll(By.css('.workout-item'));
    expect(items.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Running');
    expect(fixture.nativeElement.textContent).toContain('30 min');
  });
});
