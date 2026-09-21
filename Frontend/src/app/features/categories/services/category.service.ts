import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
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

  loadCategories(): void {
    this.#isLoading.set(true);
    this.http.get<Category[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.#categories.set(this.sortByName(data));
        this.#isLoading.set(false);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kategorien:', err);
        this.#isLoading.set(false);
      },
    });
  }

  createCategory(dto: CreateCategoryDto): void {
    this.http.post<Category>(this.apiUrl, dto).subscribe({
      next: (newCategory) => {
        this.#categories.update((list) => this.sortByName([newCategory, ...list]));
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  updateCategory(id: string, dto: UpdateCategoryDto): void {
    this.http.put<Category>(`${this.apiUrl}/${id}`, dto).subscribe({
      next: (updated) => {
        this.#categories.update((list) =>
          this.sortByName(list.map((c) => (c.id === id ? updated : c))),
        );
      },
      error: (err) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  deleteCategory(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.#categories.update((list) => list.filter((c) => c.id !== id));
      },
      error: (err) => console.error('Fehler beim Löschen:', err),
    });
  }
}
