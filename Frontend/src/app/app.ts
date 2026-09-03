import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PATHS } from './core/config/path.config';
import { Navigation } from './shared/components/navigation/navigation';
import { NavigationItem } from './shared/components/navigation/navigation.types';

@Component({
  imports: [RouterOutlet, Navigation],
  selector: 'app-root',
  template: `
    <app-navigation [links]="getAvailableLinks()"></app-navigation>

    <div>
      <router-outlet></router-outlet>
    </div>
  `,

})
export class App {
  getAvailableLinks(): NavigationItem[] {
    return Object.values(PATHS);
  }
}