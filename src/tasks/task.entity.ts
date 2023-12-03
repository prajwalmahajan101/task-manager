import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Member } from '../members/member.entity';
export const StatusTypes: IStatus = {
  Completed: 'completed',
  InProgress: 'in-progress',
  NotStarted: 'not-started',
};

export type keyType = 'Completed' | 'InProgress' | 'NotStarted';
export type valueType = 'completed' | 'in-progress' | 'not-started';
export type IStatus = {
  [key in keyType]: 'completed' | 'in-progress' | 'not-started';
};

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column({ default: 'not-started' })
  status: 'completed' | 'in-progress' | 'not-started';

  @ManyToOne(() => Member, (member) => member.tasks)
  assignee: Member;
}
