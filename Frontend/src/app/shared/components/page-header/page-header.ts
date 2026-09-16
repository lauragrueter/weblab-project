import { Component, Input } from '@angular/core';

@Component({
  selector: 'fitLog-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ title }}</h1>
      @if (subtitle) {
        <p class="page-subtitle">{{ subtitle }}</p>
      }
    </div>
  `,
  styleUrl: './page-header.css'
})
export class FitLogPageHeader {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}