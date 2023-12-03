import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Team } from './team.entity';
import {
  CreateMembersReturnType,
  CreateMembersType,
  MembersService,
} from '../members/members.service';
import { Member } from '../members/member.entity';

export type CreateTeamType = {
  name: string;
};

export type CreateTeamReturnType = {
  name: string;
  members: CreateMembersReturnType;
};

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private tasksRepository: Repository<Team>,
    private membersService: MembersService,
  ) {}

  async create(
    name: string,
    members: CreateMembersType,
  ): Promise<CreateTeamReturnType> {
    try {
      const team: CreateTeamType = {
        name,
      };
      const ak: InsertResult = await this.tasksRepository.insert(team);
      const id: number = ak.generatedMaps[0].id;
      const teamCreated: Team = await this.tasksRepository.findOneBy({ id });
      const membersData: CreateMembersReturnType =
        await this.membersService.createMultiple(members, teamCreated);
      return { ...team, members: membersData };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getMembers(id: number): Promise<Member[]> {
    const team: Team = await this.tasksRepository.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!team)
      throw new NotFoundException({ message: `Team with id ${id} Not Found` });
    return team.members;
  }

  async getById(id: number): Promise<Team | null> {
    return this.tasksRepository.findOne({
      where: { id },
      relations: ['members'],
    });
  }

  async getAll(): Promise<Team[]> {
    return this.tasksRepository.find({ relations: ['members'] });
  }
}
