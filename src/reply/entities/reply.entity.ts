import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Message, message => message.replies, { nullable: false })
  message: Message;

  @ManyToOne(() => User, user => user.replies, { nullable: false })
  sender: User;

  @Column('text')
  content: string;

  @Column('simple-array', { nullable: true })
  files: string[];

  @CreateDateColumn()
  created_at: Date;
}
