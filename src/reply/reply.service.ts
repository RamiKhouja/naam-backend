import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './entities/reply.entity';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createReplyDto: CreateReplyDto): Promise<Reply> {
    const { messageId, senderId, content, files } = createReplyDto;

    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) {
      throw new NotFoundException(`Sender with ID ${senderId} not found`);
    }

    const reply = this.replyRepository.create({
      message,
      sender,
      content,
      files,
    });

    return this.replyRepository.save(reply);
  }

  async findAll(): Promise<Reply[]> {
    return this.replyRepository.find({ relations: ['message', 'sender'] });
  }

  async findOne(id: number): Promise<Reply> {
    const reply = await this.replyRepository.findOne({
      where: { id },
      relations: ['message', 'sender'],
    });
    if (!reply) {
      throw new NotFoundException(`Reply with ID ${id} not found`);
    }
    return reply;
  }

  async update(id: number, updateReplyDto: Partial<CreateReplyDto>): Promise<Reply> {
    const reply = await this.findOne(id);

    if (updateReplyDto.content !== undefined) {
      reply.content = updateReplyDto.content;
    }
    if (updateReplyDto.files !== undefined) {
      reply.files = updateReplyDto.files;
    }

    return this.replyRepository.save(reply);
  }

  async remove(id: number): Promise<void> {
    const reply = await this.findOne(id);
    await this.replyRepository.remove(reply);
  }
}
