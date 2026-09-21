import { Category } from '../../categories/models/category.model';

export interface Workout {
  id: string;
  date: string;
  duration: number; // in minutes
  name: string;
  category?: Category | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateWorkoutDto = Omit<Workout, 'id' | 'createdAt' | 'updatedAt' | 'category'> & {
  categoryId?: string | null; // Nur die ID zum Verknüpfen senden
};
export type UpdateWorkoutDto = Partial<CreateWorkoutDto>;
