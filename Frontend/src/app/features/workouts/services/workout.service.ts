import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workout, CreateWorkoutDto, UpdateWorkoutDto } from '../models/workout.model';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private http = inject(HttpClient);
  private apiUrl = `/api/workouts`;

  #workouts = signal<Workout[]>([]);
  #isLoading = signal<boolean>(false);

  readonly workouts = this.#workouts.asReadonly();
  readonly isLoading = this.#isLoading.asReadonly();

  readonly totalWorkouts = computed(() => this.#workouts().length);
  readonly totalDurationMinutes = computed(() =>
    this.#workouts().reduce((sum, w) => sum + w.duration, 0),
  );

  private sortByDate(workouts: Workout[]): Workout[] {
    return [...workouts].sort((a, b) => b.date.localeCompare(a.date));
  }

  loadWorkouts(): void {
    this.#isLoading.set(true);
    this.http.get<Workout[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.#workouts.set(this.sortByDate(data));
        this.#isLoading.set(false);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Workouts:', err);
        this.#isLoading.set(false);
      },
    });
  }

  createWorkout(dto: CreateWorkoutDto): void {
    this.http.post<Workout>(this.apiUrl, dto).subscribe({
      next: (newWorkout) => {
        this.#workouts.update((list) => this.sortByDate([newWorkout, ...list]));
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  updateWorkout(id: string, dto: UpdateWorkoutDto): void {
    this.http.put<Workout>(`${this.apiUrl}/${id}`, dto).subscribe({
      next: (updated) => {
        this.#workouts.update((list) =>
          this.sortByDate(list.map((w) => (w.id === id ? updated : w))),
        );
      },
      error: (err) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  deleteWorkout(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.#workouts.update((list) => list.filter((w) => w.id !== id));
      },
      error: (err) => console.error('Fehler beim Löschen:', err),
    });
  }
}
