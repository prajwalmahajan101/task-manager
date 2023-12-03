import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { MembersService } from './members.service';
import { Task } from '../tasks/task.entity';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private membersService: MembersService) {}
  @Get('/:id/tasks')
  async getTasks(@Param('id') id: number): Promise<Task[]> {
    if (isNaN(id))
      throw new BadRequestException({ message: 'id must be a number' });
    return await this.membersService.getTasks(id);
  }
}
