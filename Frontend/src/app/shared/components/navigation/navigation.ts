import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import {NavigationItem} from './navigation.types';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navigation',
  styleUrl: 'navigation.css',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <nav data-testid="TOP_LEVEL_NAVBAR">
      @for (linkItem of links(); track linkItem.path) {
        <a [routerLink]="linkItem.path" routerLinkActive="active">{{ linkItem.label }}</a>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Navigation {

  links = input.required<NavigationItem[]>()

}