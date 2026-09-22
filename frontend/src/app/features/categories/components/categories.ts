import { Component, inject } from '@angular/core';
import { FitLogPageHeader } from '../../../shared/components/page-header/page-header';
import { FitLogActionToolbar } from '../../../shared/components/action-toolbar/action-toolbar';
import { FitLogCreateButton } from '../../../shared/components/create-button/create-button';
import { CategoryList } from './category-list/category-list';
import { CategoryFormDialog } from './category-form-dialog/category-form-dialog';
import { CategoryService } from '../services/category.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateCategoryDto } from '../models/category.model';

@Component({
  imports: [
    FitLogPageHeader,
    FitLogActionToolbar,
    FitLogCreateButton,
    CategoryList,
    MatDialogModule,
  ],
  selector: 'fitlog-categories',
  styleUrl: './categories.css',
  templateUrl: './categories.html',
})
export class Categories {
  protected categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);

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
}
