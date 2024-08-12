import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { senderId, receiverId, channelId, content, files } = createMessageDto;

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) {
      throw new NotFoundException(`Sender with ID ${senderId} not found`);
    }

    let receiver = null;
    if (receiverId) {
      receiver = await this.userRepository.findOne({ where: { id: receiverId } });
      if (!receiver) {
        throw new NotFoundException(`Receiver with ID ${receiverId} not found`);
      }
    }

    let channel = null;
    if (channelId) {
      channel = await this.channelRepository.findOne({ where: { id: channelId } });
      if (!channel) {
        throw new NotFoundException(`Channel with ID ${channelId} not found`);
      }
    }

    const message = this.messageRepository.create({
      sender,
      receiver,
      channel,
      content,
      files,
    });

    return this.messageRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({ relations: ['sender', 'receiver', 'channel'] });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'channel'],
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: Partial<CreateMessageDto>): Promise<Message> {
    const message = await this.findOne(id);

    if (updateMessageDto.content !== undefined) {
      message.content = updateMessageDto.content;
    }
    if (updateMessageDto.files !== undefined) {
      message.files = updateMessageDto.files;
    }

    return this.messageRepository.save(message);
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);
  }
}
