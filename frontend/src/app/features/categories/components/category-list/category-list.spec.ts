import { describe, it, expect } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CategoryList } from './category-list';
import { FitLogTable } from '../../../../shared/components/table/table';

describe('CategoryList', () => {
  let fixture: ComponentFixture<CategoryList>;
  let component: CategoryList;

  const mockCategory = { id: '1', name: 'Cardio' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryList],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', [mockCategory]);
    fixture.detectChanges();
  });

  it('passes categories and loading down to the table', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(FitLogTable)).componentInstance;
    expect(table.items()).toEqual([mockCategory]);
    expect(table.loading()).toBe(true);
  });

  it('emits delete with the category id when the table emits delete', () => {
    let emitted: string | undefined;
    component.delete.subscribe((id) => (emitted = id));

    const table = fixture.debugElement.query(By.directive(FitLogTable)).componentInstance;
    table.delete.emit(mockCategory);

    expect(emitted).toBe('1');
  });

  it('emits edit when the table emits edit', () => {
    let emitted: typeof mockCategory | undefined;
    component.edit.subscribe((c) => (emitted = c));

    const table = fixture.debugElement.query(By.directive(FitLogTable)).componentInstance;
    table.edit.emit(mockCategory);

    expect(emitted).toEqual(mockCategory);
  });

  describe('categorySearchFn', () => {
    it('matches case-insensitively', () => {
      const c = { name: 'Cardio' } as any;
      expect(component.categorySearchFn(c, 'card')).toBe(true);
      expect(component.categorySearchFn(c, 'CARD')).toBe(true);
      expect(component.categorySearchFn(c, 'kraft')).toBe(false);
    });
  });
});
