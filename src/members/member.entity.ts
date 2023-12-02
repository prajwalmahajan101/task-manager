import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Team } from '../teams/team.entity';
@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  @ManyToOne(() => Team, (team) => team.members)
  team: Team;
}
