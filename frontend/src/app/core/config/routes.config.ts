import { Route } from '@angular/router';
import { PATHS } from './path.config';

const { WORKOUTS, WORKOUTCALENDAR, CATEGORIES } = PATHS;

export const routes: Route[] = [
  {
    path: WORKOUTS.path,
    loadComponent: () =>
      import('../../features/workouts/container/workouts').then((m) => m.Workouts),
  },
  {
    path: WORKOUTCALENDAR.path,
    loadComponent: () =>
      import('../../features/workout-calendar/container/workout-calendar').then(
        (m) => m.WorkoutCalendar,
      ),
  },
  {
    path: CATEGORIES.path,
    loadComponent: () =>
      import('../../features/categories/container/categories').then((m) => m.Categories),
  },
  {
    path: '**',
    redirectTo: WORKOUTS.path,
  },
];
