import {
  IsString,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export function IsNonPrimitiveArray(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsNonPrimitiveArray',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            Array.isArray(value) &&
            value.reduce(
              (a, b) => a && typeof b === 'object' && !Array.isArray(b),
              true,
            )
          );
        },
      },
    });
  };
}

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
