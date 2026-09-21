import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NavigationItem } from './navigation.types';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'fitlog-navigation',
  styleUrl: 'navigation.css',
  imports: [RouterLink, RouterLinkActive, MatTabsModule, MatIconModule],
  template: `
    <nav mat-tab-nav-bar [tabPanel]="tabPanel" data-testid="TOP_LEVEL_NAVBAR">
      @for (linkItem of links(); track linkItem.path) {
        <a
          mat-tab-link
          [routerLink]="linkItem.path"
          routerLinkActive
          #rla="routerLinkActive"
          [active]="rla.isActive"
        >
          @if (linkItem.icon) {
            <mat-icon class="tab-icon">{{ linkItem.icon }}</mat-icon>
          }
          <span>{{ linkItem.label }}</span>
        </a>
      }
    </nav>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
  `,
  styles: [
    `
      .tab-icon {
        margin-right: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation {
  links = input.required<NavigationItem[]>();
}
