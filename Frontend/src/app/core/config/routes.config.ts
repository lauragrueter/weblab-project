import { Route } from '@angular/router';
import { PATHS } from './path.config';

const { WORKOUTS, WORKOUTCALENDAR, CATEGORIES } = PATHS;

export const routes: Route[] = [
  {
    path: WORKOUTS.path,
    loadComponent: () => import('../../features/workouts/workouts').then(m => m.Workouts)
  },
  {
    path: WORKOUTCALENDAR.path,
    loadComponent: () => import('../../features/workouts/components/calendar/workout-calendar').then(m => m.WorkoutCalendar)
  },
  {
    path: CATEGORIES.path,
    loadComponent: () => import('../../features/categories/components/categories').then(m => m.Categories)
  },
  {
    path: '**',
    redirectTo: WORKOUTS.path
  }
];