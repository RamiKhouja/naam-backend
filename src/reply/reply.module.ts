import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Message, User])],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService]
})
export class ReplyModule {}
