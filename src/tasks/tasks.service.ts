import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusTypes, Task } from './task.entity';
import { MembersService } from '../members/members.service';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private membersService: MembersService,
  ) {}

  async create(description: string, dueDate: Date, assigneeID?: number) {
    const task = {
      description,
      dueDate,
      status: StatusTypes.NotStarted,
    };
    if (assigneeID) {
      const assignee = await this.membersService.find(assigneeID);
      if (assignee) {
        task['assignee'] = assignee;
      }
    }
    const ak = await this.taskRepository.insert(task);
    const id = ak.generatedMaps[0].id;
    return { ...task, id };
  }

  async createMany(
    tasks: { description: string; dueDate: Date; assigneeID?: number }[],
  ) {
    for (const task of tasks) {
      if (task.assigneeID)
        task['assignee'] = await this.membersService.find(task.assigneeID);
    }

    const ak = await this.taskRepository.insert(tasks);
    return tasks.map((task, i) => ({ ...task, id: ak.generatedMaps[i].id }));
  }

  async asign(taskId: number, assigneeId: number) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignee'],
    });
    if (!task) {
      throw new NotFoundException({ message: 'Task not Found' });
    }
    // if (task.assignee)
    //   throw new BadRequestException({
    //     message: 'Task Already assigned To Someone. Try Updating..',
    //   });
    const assignee = await this.membersService.find(assigneeId);
    if (!assignee) {
      throw new NotFoundException({ message: 'Assignee not Found' });
    }
    await this.taskRepository.update(taskId, { assignee });
    return await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignee'],
    });
  }

  getById(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  getAll() {
    return this.taskRepository.find({ relations: ['assignee'] });
  }

  async update(id: number, data: Partial<Task>) {
    const task = await this.getById(id);
    if (!task) throw new NotFoundException({ message: 'Task not found' });
    await this.taskRepository.update(id, data);
    return await this.getById(id);
  }
}
