import { Module } from '@nestjs/common';
import { UserChannelService } from './user-channel.service';
import { UserChannelController } from './user-channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChannel } from './entities/user-channel.entity';
import { User } from 'src/user/entities/user.entity';
import { Channel } from 'diagnostics_channel';

@Module({
  imports: [TypeOrmModule.forFeature([UserChannel, User, Channel])],
  controllers: [UserChannelController],
  providers: [UserChannelService],
  exports: [UserChannelService]
})
export class UserChannelModule {}
