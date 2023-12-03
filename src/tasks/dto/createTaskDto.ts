import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  description: string;

  @IsDateString({ strict: true })
  dueDate: Date;

  @IsNumber()
  @IsOptional()
  assignee: number;
}
