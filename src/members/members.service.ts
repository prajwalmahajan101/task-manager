import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { Team } from '../teams/team.entity';
import { Task } from '../tasks/task.entity';

export type CreateMemberType = {
  name: string;
};

export type CreateMemberDataType = {
  name: string;
  team: Team;
};

export type CreateMembersType = CreateMemberType[];

export type CreateMemberReturnType = {
  id: number;
  name: string;
};

export type CreateMembersReturnType = CreateMemberReturnType[];

export type CreateMembersDataType = CreateMemberDataType[];

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private membersRepository: Repository<Member>,
  ) {}

  find(id: number): Promise<Member | null> {
    return this.membersRepository.findOneBy({ id });
  }

  getByIdWithTask(id: number): Promise<Member | null> {
    return this.membersRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
  }
  getAll(): Promise<Member[]> {
    return this.membersRepository.find({ relations: ['tasks'] });
  }

  async createMultiple(
    members: CreateMembersType,
    team: Team,
  ): Promise<CreateMembersReturnType> {
    try {
      const membersData: CreateMembersDataType = members.map(
        (member: CreateMemberType): CreateMemberDataType => ({
          ...member,
          team,
        }),
      );
      const membersCreated = await this.membersRepository.insert(membersData);
      return membersData.map(
        (
          member: CreateMemberDataType,
          index: number,
        ): CreateMemberReturnType => ({
          name: member.name,
          id: +membersCreated.generatedMaps[index].id as number,
        }),
      );
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getTasks(id: number): Promise<Task[]> {
    const member: Member | undefined = await this.membersRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!member) {
      throw new NotFoundException({
        message: `Member with id : ${id} not found`,
      });
    }
    return member.tasks;
  }
}
