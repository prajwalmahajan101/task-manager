import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTeamReturnType, TeamsService } from './teams.service';
import { Member } from '../members/member.entity';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}
  @Post('/')
  async createMember(
    @Body() teamCreateDto: Record<string, any>,
  ): Promise<CreateTeamReturnType> {
    //TODO: Add Validation
    return await this.teamsService.create(
      teamCreateDto.name,
      teamCreateDto.members,
    );
  }

  @Get('/:id/members')
  async getMembers(@Param('id') id: number): Promise<Member[]> {
    id = +id;
    return await this.teamsService.getMembers(id);
  }
}
