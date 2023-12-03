import { ValidateNested } from 'class-validator';
import { IsNonPrimitiveArray } from '../../util/validatorArry';
import { Type } from 'class-transformer';
import { CreateTaskDto } from './createTaskDto';

export class CreateTaskMultipleDto {
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}
