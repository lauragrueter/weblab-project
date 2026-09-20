import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FitLogTable } from '../../../../shared/components/table/table';
import { CategoryService } from '../../services/category.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColumnDef } from '../../../../shared/components/table/table';
import { Category } from '../../models/category.model';
import { CategoryFormDialog } from '../category-form-dialog/category-form-dialog';


@Component({
  selector: 'category-list',
  imports: [
    CommonModule,
    FormsModule,
    FitLogTable,
    MatDialogModule
  ],
  template: `
    <fitLog-table
      [items]="categoryService.categories()"
      [columns]="columns"
      searchPlaceholder="Kategorien durchsuchen"
      [searchFn]="categorySearchFn"
      (edit)="editCategory($event)"
      (delete)="deleteCategory($event.id)"
  />
`
})
  
export class CategoryList implements OnInit {
  categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);

  columns: ColumnDef<Category>[] = [
    { key: 'name', header: 'Beschreibung', value: (w) => w.name },
  ];

  categorySearchFn = (w: Category, term: string) => w.name.toLowerCase().includes(term);
  
  ngOnInit(): void {
    this.categoryService.loadCategories();
  }

    editCategory(category: Category): void {
        const dialogRef = this.dialog.open(CategoryFormDialog, {
          width: '25rem',
          data: { category },
        });
        dialogRef.afterClosed().subscribe((formData: Category | undefined) => {
          if (formData) {
            const { id, ...dto } = formData;
            this.categoryService.updateCategory(category.id, dto);
          }
        });
      }
    
      deleteCategory(id: string): void {
        this.categoryService.deleteCategory(id);
      }
    }

