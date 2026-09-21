import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'fitlog-create-button',
  styleUrl: './create-button.css',
  template: `
    <button
      mat-raised-button
      color="primary"
      class="create-button"
      (click)="onClick()"
      [attr.aria-label]="label()"
      data-test-id="create-button"
    >
      <mat-icon>add</mat-icon>
      <span>{{ label() }}</span>
    </button>
  `,
})
export class FitLogCreateButton {
  label = input.required<string>();
  btnClick = output<void>();

  onClick(): void {
    this.btnClick.emit();
  }
}
