import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MembersService],
  exports: [MembersService],
  controllers: [MembersController],
})
export class MembersModule {}
