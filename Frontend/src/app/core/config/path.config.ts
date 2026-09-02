import {NavigationItem} from '../../shared/components/navigation/navigation.types';

export const PATHS: { [key: string]: NavigationItem } = {
  HOME: {
    path: 'home',
    label: 'Home'
  },
  SETTINGS: {
    path: 'settings',
    label: 'Settings'
  },
  CREATE: {
    path: 'create',
    label: 'Erstellen'
  }
}