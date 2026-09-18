import { Route } from '@angular/router';
import { PATHS } from './path.config';
import { Workouts } from '../../features/workouts/workouts';
import { WorkoutCalendar } from '../../features/workouts/components/calendar/workout-calendar';
import { Categories } from '../../features/categories/components/categories';

const { WORKOUTS, WORKOUTCALENDAR,CATEGORIES } = PATHS;

export const routes: Route[] = [
  {
    path: WORKOUTS.path,
    component: Workouts
  },
  {
    path: WORKOUTCALENDAR.path,
    component: WorkoutCalendar
  },
  {
    path: CATEGORIES.path,
    component: Categories
  },
  {
    path: '**',
    redirectTo: WORKOUTS.path
  }
];