import { Route } from '@angular/router';
import { PATHS } from './path.config';
import { Categories } from '../../features/categories/categories';
import { WorkoutsComponent } from '../../features/workouts/workouts';
import { WorkoutCalendarComponent } from '../../features/workouts/components/calendar/workout-calendar';

const { HOME, WORKOUTCALENDAR, SETTINGS } = PATHS;

export const routes: Route[] = [
  {
    path: HOME.path,
    component: WorkoutsComponent
  },
  {
    path: SETTINGS.path,
    component: Categories
  },
  {
    path: WORKOUTCALENDAR.path,
    component: WorkoutCalendarComponent
  },
  {
    path: '**',
    redirectTo: HOME.path
  }
];