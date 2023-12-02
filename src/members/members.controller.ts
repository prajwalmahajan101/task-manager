import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { MembersService } from './members.service';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private membersService: MembersService) {}
  @Get('/:id/tasks')
  async getTasks(@Param('id') id: number) {
    return await this.membersService.getTasks(id);
  }
}
