import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelRole, UserChannel } from 'src/user-channel/entities/user-channel.entity';
import { ChannelMemberInfoDto, CreateChannelDto, UserChannelInfoDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CreateUserChannelDto } from 'src/user-channel/dto/create-user-channel.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
        @InjectRepository(UserChannel)
        private userChannelRepository: Repository<UserChannel>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createChannelDto: CreateChannelDto, id: number): Promise<Channel> {
        const channel = this.channelRepository.create(createChannelDto);
        const newChannel = await this.channelRepository.save(channel);
        const createUserChannelDto: CreateUserChannelDto = {
          userId: id,
          channelId: newChannel.id,
          role: ChannelRole.ADMIN
        };

        const {userId, channelId, ...userChannelDto} = createUserChannelDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const userChannel = this.userChannelRepository.create({
            ...userChannelDto,
            user,
            channel:newChannel
        });

        await this.userChannelRepository.save(userChannel);
        return newChannel;
    }

    async findAll(): Promise<Channel[]> {
        return this.channelRepository.find({ relations: ['userChannels'] });
    }

    async findOne(id: number): Promise<Channel> {
        const channel = await this.channelRepository.findOne({
            where: { id },
            relations: ['userChannels'],
        });
        if (!channel) {
            throw new NotFoundException(`Channel with ID ${id} not found`);
        }
        return channel;
    }

    async update(id: number, updateChannelDto: UpdateChannelDto): Promise<Channel> {
        const channel = await this.channelRepository.preload({
            id: +id,
            ...updateChannelDto,
        });
        if (!channel) {
            throw new NotFoundException(`Channel with ID ${id} not found`);
        }
        return this.channelRepository.save(channel);
    }

    async remove(id: number): Promise<void> {
        const channel = await this.findOne(id);
        await this.channelRepository.remove(channel);
    }

    async addUser(id: number, idUser: number): Promise<UserChannel> {
        const channel = await this.channelRepository.findOne({where: {id:id}});
        if (!channel) {
            throw new NotFoundException(`Channel with ID ${id} not found`);
        }
        const user = await this.userRepository.findOne({ where: { id: idUser } });
        if (!user) {
            throw new NotFoundException(`User with ID ${idUser} not found`);
        }
        const createUserChannelDto: CreateUserChannelDto = {
            userId: idUser,
            channelId: id,
            role: ChannelRole.MEMBER
        };
        const {userId, channelId, ...userChannelDto} = createUserChannelDto;
        const userChannel = this.userChannelRepository.create({
            ...userChannelDto,
            user,
            channel
        });

        return await this.userChannelRepository.save(userChannel);
    }

    async getMyChannels(userId: number): Promise<UserChannelInfoDto[]> {
        const userChannels = await this.userChannelRepository.find({
          where: { user: { id: userId } },
          relations: ['channel'],
        });
    
        return userChannels.map(uc => ({
            channel: uc.channel,
            role: uc.role,
            is_archived: uc.is_archived,
            is_favourite: uc.is_favourite,
        }));
    }

    async getChannelMembers(channelId: number): Promise<ChannelMemberInfoDto[]> {
        const userChannels = await this.userChannelRepository.find({
          where: { channel: { id: channelId } },
          relations: ['user'],
        });
    
        return userChannels.map(uc => ({
          user: uc.user,
          role: uc.role
        }));
      }
}
