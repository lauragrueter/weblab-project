import { Component, input } from '@angular/core';

@Component({
  selector: 'fitLog-page-header',
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ title() }}</h1>
      @if (subtitle()) {
        <p class="page-subtitle">{{ subtitle() }}</p>
      }
    </div>
  `,
  styleUrl: './page-header.css'
})
export class FitLogPageHeader {
  title = input.required<string>();
  subtitle = input<string>();
}