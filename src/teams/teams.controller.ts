import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTeamReturnType, TeamsService } from './teams.service';
import { Member } from '../members/member.entity';
import { TeamCreateDto } from './dto/teamCreateDto';

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
}
