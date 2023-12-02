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
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { StatusTypes, Task } from './task.entity';
dayjs.extend(customParseFormat);
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private tasksServices: TasksService) {}

  @Post('/')
  async create(@Body() createDto: Record<string, any>) {
    const dueDate = dayjs(createDto.dueDate, 'DD-MM-YYYY');
    return await this.tasksServices.create(
      createDto.description,
      new Date(dueDate.toString()),
      createDto.assignee ?? undefined,
    );
  }

  @Post('/create')
  async createMultiple(@Body() createDto: Record<string, any>) {
    const tasks = createDto.tasks.map((task) => ({
      ...task,
      assigneeID: task.assignee,
      dueDate: new Date(dayjs(task.dueDate, 'DD-MM-YYYY').toString()),
    }));
    return await this.tasksServices.createMany(tasks);
  }

  @Post('/assign')
  async assign(@Body() assignDto: Record<string, any>) {
    return await this.tasksServices.asign(assignDto.taskId, assignDto.assignee);
  }

  @Get('/')
  async getAll() {
    return await this.tasksServices.getAll();
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: Record<string, any>,
  ) {
    const data: Partial<Task> = {};
    if (updateDto.description) data['description'] = updateDto.description;
    if (updateDto.dueDate)
      data['dueDate'] = new Date(
        dayjs(updateDto.dueDate, 'DD-MM-YYYY').toString(),
      );
    if (updateDto.status) {
      const status = updateDto.status.toLowerCase();
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
