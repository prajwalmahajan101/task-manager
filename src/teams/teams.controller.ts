import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { TeamsService } from './teams.service';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}
  @Post('/')
  async createMember(@Body() teamCreateDto: Record<string, any>) {
    return await this.teamsService.create(
      teamCreateDto.name,
      teamCreateDto.members,
    );
  }

  @Get('/:id/members')
  async getMembers(@Param('id') id: number) {
    return await this.teamsService.getMembers(id);
  }
}
