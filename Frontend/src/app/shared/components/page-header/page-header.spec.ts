import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FitLogPageHeader } from './page-header';

describe('FitLogPageHeader', () => {
  let fixture: ComponentFixture<FitLogPageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitLogPageHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(FitLogPageHeader);
    fixture.componentRef.setInput('title', 'Title');
    fixture.detectChanges();
  });

  it('renders the required title', () => {
    const title = fixture.debugElement.query(By.css('.page-title'));
    expect(title.nativeElement.textContent.trim()).toBe('Title');
  });

  it('renders the subtitle when provided', () => {
    fixture.componentRef.setInput('subtitle', 'Subtitle');
    fixture.detectChanges();

    const subtitle = fixture.debugElement.query(By.css('.page-subtitle'));
    expect(subtitle.nativeElement.textContent.trim()).toBe('Subtitle');
  });

  it('does not render a subtitle element when none is provided', () => {
    const subtitle = fixture.debugElement.query(By.css('.page-subtitle'));
    expect(subtitle).toBeNull();
  });
});