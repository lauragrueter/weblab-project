import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Category } from '../../categories/entities/categories.entity.js';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int' })
  duration: number; // in minutes

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category?: Category | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
