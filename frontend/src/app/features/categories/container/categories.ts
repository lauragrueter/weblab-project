import { Component, inject, OnInit } from '@angular/core';
import { FitLogPageHeader } from '../../../shared/components/page-header/page-header';
import { FitLogActionToolbar } from '../../../shared/components/action-toolbar/action-toolbar';
import { FitLogCreateButton } from '../../../shared/components/create-button/create-button';
import { CategoryList } from '../components/category-list/category-list';
import { CategoryFormDialog } from '../components/category-form-dialog/category-form-dialog';
import { CategoryService } from '../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { Category, CreateCategoryDto } from '../models/category.model';

@Component({
  selector: 'fitlog-categories',
  imports: [FitLogPageHeader, FitLogActionToolbar, FitLogCreateButton, CategoryList],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  protected categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.categoryService.loadCategories();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormDialog, {
      width: '25rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe((formData: CreateCategoryDto | undefined) => {
      if (formData) {
        this.categoryService.createCategory(formData);
      }
    });
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
