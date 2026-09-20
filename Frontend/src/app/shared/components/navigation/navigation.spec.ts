import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Navigation } from './navigation';
import { NavigationItem } from './navigation.types';

describe('Navigation', () => {
  let fixture: ComponentFixture<Navigation>;

  const links: NavigationItem[] = [
    { path: '/workouts', label: 'Workouts', icon: 'fitness_center' },
    { path: '/categories', label: 'Kategorien' }, // no icon
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
  });

  it('renders one link per navigation item', () => {
    fixture.componentRef.setInput('links', links);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('a[mat-tab-link]'));
    expect(items.length).toBe(2);
  });

  it('renders no links when the input array is empty', () => {
    fixture.componentRef.setInput('links', []);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('a[mat-tab-link]'));
    expect(items.length).toBe(0);
  });

  it('renders an icon only for links that define one', () => {
    fixture.componentRef.setInput('links', links);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('a[mat-tab-link]'));
    const iconInFirst = items[0].query(By.css('mat-icon'));
    const iconInSecond = items[1].query(By.css('mat-icon'));

    expect(iconInFirst).not.toBeNull();
    expect(iconInSecond).toBeNull();
  });
});