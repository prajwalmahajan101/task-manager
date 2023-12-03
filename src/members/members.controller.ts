import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { MembersService } from './members.service';
import { Task } from '../tasks/task.entity';
import { Member } from './member.entity';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private membersService: MembersService) {}
  @Get('/:id/tasks')
  async getTasks(@Param('id') id: number): Promise<Task[]> {
    if (isNaN(id))
      throw new BadRequestException({
        message: 'Member id (Param) must be a number',
      });
    return await this.membersService.getTasks(id);
  }

  @Get('/')
  async getAll(): Promise<Member[]> {
    return await this.membersService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: number): Promise<Member> {
    if (isNaN(id))
      throw new BadRequestException({
        message: 'Member id (Param) must be a number',
      });

    const member = await this.membersService.getByIdWithTask(id);
    if (!member)
      throw new NotFoundException({
        message: `Member with id ${id} not found`,
      });
    return member;
  }
}
