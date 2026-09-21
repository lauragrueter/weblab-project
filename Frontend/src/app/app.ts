import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PATHS } from './core/config/path.config';
import { Navigation } from './shared/components/navigation/navigation';
import { NavigationItem } from './shared/components/navigation/navigation.types';

@Component({
  imports: [RouterOutlet, Navigation],
  selector: 'app-root',
  template: `
    <fitlog-navigation [links]="getAvailableLinks()"></fitlog-navigation>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App {
  getAvailableLinks(): NavigationItem[] {
    return Object.values(PATHS);
  }
}
