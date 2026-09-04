import { Component, inject, OnInit } from '@angular/core';
import { WorkoutService } from './services/workout.service';

@Component({
  selector: 'app-root',
  styleUrl: './workouts.component.css',
  template: `
    <h1>FitLog Dashboard</h1>
    <p>Status: {{ workoutService.isLoading() ? 'Lädt...' : '' }}</p>
    <p>Anzahl Workouts: {{ workoutService.totalWorkouts() }}</p>
    <p>Gesamtdauer: {{ workoutService.totalDurationMinutes() }} Minuten</p>

    <ul>
      @for (workout of workoutService.workouts(); track workout.id) {
        <li>{{ workout.date }} - {{ workout.description }} ({{ workout.duration }} Min)</li>
      } @empty {
        <li>Keine Workouts vorhanden.</li>
      }
    </ul>
  `
})
export class WorkoutComponent implements OnInit {
  protected workoutService = inject(WorkoutService);

  ngOnInit(): void {
    this.workoutService.loadWorkouts();
  }
}