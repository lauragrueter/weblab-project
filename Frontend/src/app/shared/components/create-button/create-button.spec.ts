import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FitLogCreateButton } from './create-button';

describe('FitLogCreateButton', () => {
  let fixture: ComponentFixture<FitLogCreateButton>;
  let component: FitLogCreateButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitLogCreateButton],
    }).compileComponents();

    fixture = TestBed.createComponent(FitLogCreateButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'button lable');
    fixture.detectChanges();
  });

  it('emits btnClick when the button is clicked', () => {
    const emitSpy = vi.spyOn(component.btnClick, 'emit');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('does not emit btnClick before any interaction', () => {
    const emitSpy = vi.spyOn(component.btnClick, 'emit');

    expect(emitSpy).not.toHaveBeenCalled();
  });
});