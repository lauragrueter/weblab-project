import { Route } from '@angular/router';
import { Home } from '../../features/home/home';
import { PATHS } from './path.config';
import { Categories } from '../../features/categories/categories';
import { Trainings } from '../../features/trainings/trainings';

const { HOME, SETTINGS, CREATE } = PATHS;

export const routes: Route[] = [
  {
    path: HOME.path,
    component: Home
  },
  {
    path: SETTINGS.path,
    component: Categories
  },
  {
    path: CREATE.path,
    component: Trainings
  },
  {
    path: '**',
    redirectTo: HOME.path
  }
];