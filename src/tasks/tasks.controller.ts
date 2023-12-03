import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CreateTasksReturnType, TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { StatusTypes, Task } from './task.entity';
dayjs.extend(customParseFormat);
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private tasksServices: TasksService) {}

  @Post('/')
  async create(@Body() createTaskDto: Record<string, any>): Promise<Task> {
    //TODO: Add Validation
    const dueDate = dayjs(createTaskDto.dueDate, 'DD-MM-YYYY');
    return await this.tasksServices.create(
      createTaskDto.description,
      new Date(dueDate.toString()),
      createTaskDto.assignee ?? undefined,
    );
  }

  @Post('/create')
  async createMultiple(
    @Body() createTaskMultipleDto: Record<string, any>,
  ): Promise<CreateTasksReturnType[]> {
    //TODO: Add Validation
    const tasks = createTaskMultipleDto.tasks.map((task) => ({
      ...task,
      assigneeID: task.assignee,
      dueDate: new Date(dayjs(task.dueDate, 'DD-MM-YYYY').toString()),
    }));
    return await this.tasksServices.createMany(tasks);
  }

  @Post('/assign')
  async assign(@Body() assignTaskDto: Record<string, any>): Promise<Task> {
    //TODO: Add Validation
    return await this.tasksServices.assign(
      assignTaskDto.taskId,
      assignTaskDto.assignee,
    );
  }

  @Get('/')
  async getAll(): Promise<Task[]> {
    return await this.tasksServices.getAll();
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: Record<string, any>,
  ): Promise<Task> {
    //TODO: Add Validation
    const data: Partial<Task> = {};
    if (updateTaskDto.description)
      data['description'] = updateTaskDto.description;
    if (updateTaskDto.dueDate)
      data['dueDate'] = new Date(
        dayjs(updateTaskDto.dueDate, 'DD-MM-YYYY').toString(),
      );
    if (updateTaskDto.status) {
      const status = updateTaskDto.status.toLowerCase();
      switch (status) {
        case 'completed':
          data['status'] = StatusTypes.Completed;
          break;
        case 'in-progress':
          data['status'] = StatusTypes.InProgress;
          break;
        case 'not-started':
          data['status'] = StatusTypes.NotStarted;
          break;
        default:
          throw new BadRequestException({
            message: 'Invalid status for task update',
          });
      }
    }
    return this.tasksServices.update(id, data);
  }
}
