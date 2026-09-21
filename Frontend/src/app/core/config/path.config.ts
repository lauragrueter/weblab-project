import { NavigationItem } from '../../shared/components/navigation/navigation.types';

export const PATHS: { [key: string]: NavigationItem } = {
  WORKOUTS: {
    path: 'home',
    label: 'Home',
    icon: 'home',
  },
  WORKOUTCALENDAR: {
    path: 'workout-calendar',
    label: 'Kalender',
    icon: 'calendar_month',
  },
  CATEGORIES: {
    path: 'categories',
    label: 'Kategorien',
    icon: 'settings',
  },
};
