import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'fitLog-action-toolbar',
  styleUrl: './action-toolbar.css',
  template: `
    <div class="action-toolbar">
      <ng-content></ng-content>
    </div>
  `,
})
export class FitLogActionToolbar {}
