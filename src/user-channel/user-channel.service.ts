import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserChannel } from './entities/user-channel.entity';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';
import { UpdateUserChannelDto } from './dto/update-user-channel.dto';
import { User } from 'src/user/entities/user.entity';
import { Channel } from 'diagnostics_channel';

@Injectable()
export class UserChannelService {
    constructor(
        @InjectRepository(UserChannel)
        private userChannelRepository: Repository<UserChannel>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>
    ) {}

      async create(createUserChannelDto: CreateUserChannelDto): Promise<UserChannel> {
        const user = await this.userRepository.findOne({ where: { id: createUserChannelDto.userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${createUserChannelDto.userId} not found`);
      }

      // const channel = await this.channelRepository.findOne({ where: { id: createUserChannelDto.channelId } });
      // if (!channel) {
      //   throw new NotFoundException(`Channel with ID ${createUserChannelDto.channelId} not found`);
      // }

      // const userChannel = this.userChannelRepository.create({
      //   ...createUserChannelDto,
      //   user,
      //   channel,
      // });

      return this.userChannelRepository.save(createUserChannelDto);
    }

    async findAll(): Promise<UserChannel[]> {
        return this.userChannelRepository.find({ relations: ['user', 'channel'] });
    }

    async findOne(id: number): Promise<UserChannel> {
        const userChannel = await this.userChannelRepository.findOne({
            where: { id },
            relations: ['user', 'channel'],
        });
        if (!userChannel) {
            throw new NotFoundException(`UserChannel with ID ${id} not found`);
        }
        return userChannel;
    }

    async update(id: number, updateUserChannelDto: UpdateUserChannelDto): Promise<UserChannel> {
        const userChannel = await this.userChannelRepository.preload({
            id: +id,
            ...updateUserChannelDto,
        });
        if (!userChannel) {
            throw new NotFoundException(`UserChannel with ID ${id} not found`);
        }
        return this.userChannelRepository.save(userChannel);
    }

    async remove(id: number): Promise<void> {
        const userChannel = await this.findOne(id);
        await this.userChannelRepository.remove(userChannel);
    }
}
