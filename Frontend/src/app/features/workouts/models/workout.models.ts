export interface Workout {
  id: string;
  date: string;
  duration: number; // in minutes
  description: string;
  createdAt?: string;
  updatedAt? : string;
}

export type CreateWorkoutDto = Omit<Workout, 'id' | 'createdAt'>;
export type UpdateWorkoutDto = Partial<CreateWorkoutDto>;