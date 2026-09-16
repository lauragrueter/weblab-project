import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'fitLog-create-button',
  styleUrl: './create-button.css',
  template: `
    <button 
      mat-raised-button 
      color="primary" 
      class="create-button" 
      (click)="onClick()"
    >
      <mat-icon>add</mat-icon>
      <span>{{ label }}</span>
    </button>
  `,
})
export class FitLogCreateButton {
  @Input({ required: true}) label!: string;
  @Output() btnClick = new EventEmitter<void>();

  onClick(): void {
    this.btnClick.emit();
  }
}
