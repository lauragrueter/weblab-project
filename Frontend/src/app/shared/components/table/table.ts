import { Component, computed, effect, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';


export interface ColumnDef<T> {
  key: string;
  header: string;
  value: (item: T) => string;
}

@Component({
  selector: 'fitLog-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
})
export class FitLogTable<T> {
  items = input.required<T[]>();
  columns = input.required<ColumnDef<T>[]>();

  showSearch = input(true);
  searchPlaceholder = input('Suchen');
  searchFn = input<(item: T, term: string) => boolean>((item, term) =>
    JSON.stringify(item).toLowerCase().includes(term.toLowerCase())
  );

  enableEdit = input(true);
  enableDelete = input(true);

  pageSize = input(10);
  pageSizeOptions = input([5, 10, 25, 100]);

  edit = output<T>();
  delete = output<T>();

  paginator = viewChild(MatPaginator);
  dataSource = new MatTableDataSource<T>([]);
  searchTerm = signal('');

  displayedColumns = computed(() => {
    const cols = this.columns().map((c) => c.key);
    return this.enableEdit() || this.enableDelete() ? [...cols, 'actions'] : cols;
  });

  filteredItems = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const all = this.items();
    if (!term) return all;
    const fn = this.searchFn();
    return all.filter((item) => fn(item, term));
  });

  private syncEffect = effect(() => {
    this.dataSource.data = this.filteredItems();
    const p = this.paginator();
    if (p) this.dataSource.paginator = p;
  });

  onSearchChange(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}