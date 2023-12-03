import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNonPrimitiveArray } from '../../util/validatorArry';

class Member {
  @IsString()
  name: string;
}
export class TeamCreateDto {
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => Member)
  members: Member[];
}
