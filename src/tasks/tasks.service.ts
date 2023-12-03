import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { StatusTypes, Task, valueType } from './task.entity';
import { MembersService } from '../members/members.service';
import { Member } from '../members/member.entity';

export type CreateTaskType = {
  description: string;
  dueDate: Date;
  status: valueType;
};

export type CreateTasksType = {
  description: string;
  dueDate: Date;
  assigneeID?: number;
};

export type CreateTasksReturnType = CreateTasksType & { id: number };

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private membersService: MembersService,
  ) {}

  async create(
    description: string,
    dueDate: Date,
    assigneeID?: number,
  ): Promise<Task> {
    try {
      const task: CreateTaskType = {
        description,
        dueDate,
        status: StatusTypes.NotStarted,
      };
      if (assigneeID) {
        const assignee: Member = await this.membersService.find(assigneeID);
        if (assignee) {
          task['assignee'] = assignee;
        }
      }
      const ak: InsertResult = await this.taskRepository.insert(task);
      const id: number = ak.generatedMaps[0].id;
      return this.getById(id);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createMany(tasks: CreateTasksType[]): Promise<CreateTasksReturnType[]> {
    try {
      for (const task of tasks) {
        if (task.assigneeID) {
          const member: Member | undefined = await this.membersService.find(
            task.assigneeID,
          );
          if (!member)
            throw new NotFoundException({
              message: `Member with id :${task.assigneeID}  not found`,
            });
          task['assignee'] = member;
        }
      }

      const ak: InsertResult = await this.taskRepository.insert(tasks);
      return tasks.map(
        (task: CreateTasksType, i: number): CreateTasksReturnType => ({
          ...task,
          id: ak.generatedMaps[i].id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async assign(taskId: number, assigneeId: number): Promise<Task> {
    const task: Task = await this.getById(taskId);
    if (!task) {
      throw new NotFoundException({ message: 'Task not Found' });
    }
    const assignee: Member = await this.membersService.find(assigneeId);
    if (!assignee) {
      throw new NotFoundException({ message: 'Assignee not Found' });
    }
    await this.taskRepository.update(taskId, { assignee });
    return await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignee'],
    });
  }

  getById(id: number): Promise<Task | undefined> {
    return this.taskRepository.findOneBy({ id });
  }

  getAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['assignee'] });
  }

  async update(id: number, data: Partial<Task>): Promise<Task> {
    try {
      const task = await this.getById(id);
      if (!task) throw new NotFoundException({ message: 'Task not found' });
      await this.taskRepository.update(id, data);
      return await this.getById(id);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
