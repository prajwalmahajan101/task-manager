import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { MembersModule } from '../members/members.module';
@Module({
  imports: [TypeOrmModule.forFeature([Team]), MembersModule],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
