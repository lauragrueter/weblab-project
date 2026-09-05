import { Route } from '@angular/router';
import { Home } from '../../features/home/home';
import { PATHS } from './path.config';
import { Categories } from '../../features/categories/categories';
import { WorkoutComponent } from '../../features/workouts/workouts.component';
import { WorkoutListComponent } from '../../features/workouts/components/workout-list/workout-list.component';

const { HOME, SETTINGS, CREATE } = PATHS;

export const routes: Route[] = [
  {
    path: HOME.path,
    component: WorkoutListComponent
  },
  {
    path: SETTINGS.path,
    component: Categories
  },
  {
    path: CREATE.path,
    component: WorkoutComponent
  },
  {
    path: '**',
    redirectTo: HOME.path
  }
];