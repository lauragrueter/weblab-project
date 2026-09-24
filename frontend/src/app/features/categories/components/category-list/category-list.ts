import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitLogTable, ColumnDef } from '../../../../shared/components/table/table';
import { Category } from '../../models/category.model';

@Component({
  selector: 'fitlog-category-list',
  imports: [CommonModule, FitLogTable],
  template: `
    <fitlog-table
      [items]="categories()"
      [columns]="columns"
      [loading]="loading()"
      searchPlaceholder="Kategorien durchsuchen"
      [searchFn]="categorySearchFn"
      (edit)="edit.emit($event)"
      (delete)="delete.emit($event.id)"
    />
  `,
})
export class CategoryList {
  categories = input.required<Category[]>();
  loading = input(false);

  edit = output<Category>();
  delete = output<string>();

  columns: ColumnDef<Category>[] = [{ key: 'name', header: 'Beschreibung', value: (w) => w.name }];

  categorySearchFn = (w: Category, term: string) =>
    w.name.toLowerCase().includes(term.toLowerCase());
}
