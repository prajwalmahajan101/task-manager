import { IsNumber } from 'class-validator';

export class AssignTaskDto {
  @IsNumber()
  taskId: number;
  @IsNumber()
  assignee: number;
}
