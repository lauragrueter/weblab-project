import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private apiUrl = `/api/categories`;

  #categories = signal<Category[]>([]);
  #isLoading = signal<boolean>(false);

  readonly categories = this.#categories.asReadonly();
  readonly isLoading = this.#isLoading.asReadonly();

  readonly totalCategories = computed(() => this.#categories().length);

  private sortByName(categories: Category[]): Category[] {
    return [...categories].sort((a, b) =>
      a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }),
    );
  }

  private notifyError(message: string, err: unknown): void {
    console.error(message, err);
    this.snackBar.open(message, 'OK', { duration: 4000 });
  }

  loadCategories(): void {
    this.#isLoading.set(true);
    this.http.get<Category[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.#categories.set(this.sortByName(data));
        this.#isLoading.set(false);
      },
      error: (err) => {
        this.notifyError('Fehler beim Laden der Kategorien.', err);
        this.#isLoading.set(false);
      },
    });
  }

  createCategory(dto: CreateCategoryDto): void {
    this.http.post<Category>(this.apiUrl, dto).subscribe({
      next: (newCategory) => {
        this.#categories.update((list) => this.sortByName([newCategory, ...list]));
      },
      error: (err) => this.notifyError('Fehler beim Erstellen der Kategorie.', err),
    });
  }

  updateCategory(id: string, dto: UpdateCategoryDto): void {
    this.http.put<Category>(`${this.apiUrl}/${id}`, dto).subscribe({
      next: (updated) => {
        this.#categories.update((list) =>
          this.sortByName(list.map((c) => (c.id === id ? updated : c))),
        );
      },
      error: (err) => this.notifyError('Fehler beim Aktualisieren der Kategorie.', err),
    });
  }

  deleteCategory(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.#categories.update((list) => list.filter((c) => c.id !== id));
      },
      error: (err) => this.notifyError('Fehler beim Löschen der Kategorie.', err),
    });
  }
}
