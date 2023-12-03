import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTeamReturnType, TeamsService } from './teams.service';
import { Member } from '../members/member.entity';
import { TeamCreateDto } from './dto/teamCreateDto';
import { Team } from './team.entity';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}
  @Post('/')
  async createMember(
    @Body() teamCreateDto: TeamCreateDto,
  ): Promise<CreateTeamReturnType> {
    return await this.teamsService.create(
      teamCreateDto.name,
      teamCreateDto.members,
    );
  }

  @Get('/:id/members')
  async getMembers(@Param('id') id: number): Promise<Member[]> {
    if (isNaN(id))
      throw new BadRequestException({
        message: 'Team id (Param) must be a number',
      });
    return await this.teamsService.getMembers(id);
  }

  @Get('/:id')
  async getTeam(@Param('id') id: number): Promise<Team> {
    if (isNaN(id))
      throw new BadRequestException({
        message: 'Team id (Param) must be a number',
      });
    const team = await this.teamsService.getById(id);
    if (!team) {
      throw new NotFoundException({ message: `Team with id ${id} not Found` });
    }
    return team;
  }

  @Get()
  async getAll(): Promise<Team[]> {
    return this.teamsService.getAll();
  }
}
