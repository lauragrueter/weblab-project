export interface Category {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCategoryDto = Omit<Category, 'id' | 'createdAt'>;
export type UpdateCategoryDto = Partial<CreateCategoryDto>;
