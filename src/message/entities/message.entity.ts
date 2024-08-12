import { Channel } from 'src/channel/entities/channel.entity';
import { Reply } from 'src/reply/entities/reply.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.sentMessages, { nullable: false })
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages, { nullable: true })
  receiver: User;

  @ManyToOne(() => Channel, channel => channel.messages, { nullable: true })
  channel: Channel;

  @Column('text')
  content: string;

  @Column('simple-array', { nullable: true })
  files: string[];

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Reply, reply => reply.message)
  replies: Reply[];

}
