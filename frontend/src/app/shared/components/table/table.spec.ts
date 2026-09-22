import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FitLogTable, ColumnDef } from './table';

interface TestItem {
  id: string;
  name: string;
}

describe('SharedTableComponent', () => {
  let fixture: ComponentFixture<FitLogTable<TestItem>>;
  let component: FitLogTable<TestItem>;

  const items: TestItem[] = [
    { id: '1', name: 'Alpha' },
    { id: '2', name: 'Beta' },
  ];

  const columns: ColumnDef<TestItem>[] = [{ key: 'name', header: 'Name', value: (i) => i.name }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitLogTable],
    }).compileComponents();

    fixture = TestBed.createComponent(FitLogTable<TestItem>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('columns', columns);
    fixture.detectChanges();
  });

  it('render all items initially', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr.mat-mdc-row'));
    expect(rows.length).toBe(2);
  });

  it('filters items with standard search', () => {
    component.searchTerm.set('alpha');
    fixture.detectChanges();

    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].name).toBe('Alpha');
  });

  it('emit edit-Event with whole object', () => {
    const emitSpy = vi.spyOn(component.edit, 'emit');
    const editButtons = fixture.debugElement.queryAll(By.css('button[color="primary"]'));

    editButtons[0].nativeElement.click();

    expect(emitSpy).toHaveBeenCalledWith(items[0]);
  });

  it('emit delete-event, whole object', () => {
    const emitSpy = vi.spyOn(component.delete, 'emit');
    const deleteButtons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));

    deleteButtons[0].nativeElement.click();

    expect(emitSpy).toHaveBeenCalledWith(items[0]);
  });

  it('actions are not visible, if deactivated', () => {
    fixture.componentRef.setInput('enableEdit', false);
    fixture.componentRef.setInput('enableDelete', false);
    fixture.detectChanges();

    expect(component.displayedColumns()).toEqual(['name']);
    expect(fixture.debugElement.query(By.css('button[color="warn"]'))).toBeNull();
  });

  it('shows a progress bar while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('mat-progress-bar'))).not.toBeNull();
  });

  it('hides the progress bar when not loading', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('mat-progress-bar'))).toBeNull();
  });
});
