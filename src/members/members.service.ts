import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { Team } from '../teams/team.entity';
@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private membersRepository: Repository<Member>,
  ) {}

  findAll(): Promise<Member[]> {
    return this.membersRepository.find();
  }

  find(id: number): Promise<Member | null> {
    return this.membersRepository.findOneBy({ id });
  }

  create(name: string, team: Team): Promise<any> {
    return this.membersRepository.insert({ name, team });
  }

  async createMultiple(members: { name: string }[], team: Team) {
    const membersData = members.map((member) => ({ ...member, team }));
    const membersCreated = await this.membersRepository.insert(membersData);
    return membersData.map((member, index) => ({
      name: member.name,
      id: membersCreated.generatedMaps[index].id,
    }));
  }

  async getTasks(id: number) {
    const member = await this.membersRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    return member.tasks;
  }
}
