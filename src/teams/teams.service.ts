import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { MembersService } from '../members/members.service';
@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private tasksRepository: Repository<Team>,
    private membersService: MembersService,
  ) {}

  async create(name: string, members: { name: string }[]): Promise<any> {
    const team = {
      name,
    };
    const ak = await this.tasksRepository.insert(team);
    const id = ak.generatedMaps[0].id;
    const teamCreated: Team = await this.tasksRepository.findOneBy({ id });
    const membersData = await this.membersService.createMultiple(
      members,
      teamCreated,
    );
    return { ...team, members: membersData };
  }

  async getMembers(id: number) {
    const team = await this.tasksRepository.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!team) throw new NotFoundException({ message: 'Team Not Found' });
    return team.members;
  }
}
