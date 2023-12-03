import { IsNumber } from 'class-validator';

export class AssignTaskDto {
  @IsNumber()
  assignee: number;
}
