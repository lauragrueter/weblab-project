import { Route } from '@angular/router';
import { PATHS } from './path.config';
import { WorkoutsComponent } from '../../features/workouts/workouts';
import { WorkoutCalendarComponent } from '../../features/workouts/components/calendar/workout-calendar';

const { HOME, WORKOUTCALENDAR } = PATHS;

export const routes: Route[] = [
  {
    path: HOME.path,
    component: WorkoutsComponent
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