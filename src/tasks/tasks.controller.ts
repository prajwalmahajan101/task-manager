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
import {
  CreateTasksReturnType,
  CreateTasksType,
  TasksService,
} from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';
import { StatusTypes, Task } from './task.entity';
import { CreateTaskMultipleDto } from './dto/createTaskMultipleDto';
import { CreateTaskDto } from './dto/createTaskDto';
import { AssignTaskDto } from './dto/assignTaskDto';
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private tasksServices: TasksService) {}

  @Post('/')
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const dueDate: Date = new Date(createTaskDto.dueDate);
    return await this.tasksServices.create(
      createTaskDto.description,
      dueDate,
      createTaskDto.assignee ?? undefined,
    );
  }

  @Post('/create')
  async createMultiple(
    @Body() createTaskMultipleDto: CreateTaskMultipleDto,
  ): Promise<CreateTasksReturnType[]> {
    const tasks: CreateTasksType[] = createTaskMultipleDto.tasks.map(
      (task) => ({
        ...task,
        assigneeID: task.assignee,
        dueDate: new Date(task.dueDate),
      }),
    );
    return await this.tasksServices.createMany(tasks);
  }

  @Post('/:id/assign')
  async assign(
    @Param('id') id: number,
    @Body() assignTaskDto: AssignTaskDto,
  ): Promise<Task> {
    if (isNaN(id))
      throw new BadRequestException({
        message: 'Task id (Param) must be a number',
      });
    return await this.tasksServices.assign(id, assignTaskDto.assignee);
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
    // TODO: Validate Body
    if (isNaN(id))
      throw new BadRequestException({
        message: 'Task id (Param) must be a number',
      });
    const data: Partial<Task> = {};
    if (updateTaskDto.description)
      data['description'] = updateTaskDto.description;
    if (updateTaskDto.dueDate)
      data['dueDate'] = new Date(updateTaskDto.dueDate);
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
