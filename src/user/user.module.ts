import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { UserChannel } from 'src/user-channel/entities/user-channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, UserChannel])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
