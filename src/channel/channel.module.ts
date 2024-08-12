import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { UserChannel } from 'src/user-channel/entities/user-channel.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Channel, UserChannel, User])],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
