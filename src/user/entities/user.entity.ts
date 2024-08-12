import { UserChannel } from 'src/user-channel/entities/user-channel.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Task } from 'src/task/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Message } from 'src/message/entities/message.entity';
import { Reply } from 'src/reply/entities/reply.entity';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super admin'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column({nullable: true})
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({nullable: true})
  phone: string;

  @Column({nullable: true})
  jobtitle: string;

  @Column({nullable: true})
  image: string;

  @Column({nullable: true})
  language: string;

  @Column({ default: true })
  is_connected: boolean;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Organization, organization => organization.users)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Task, task => task.user, {cascade: false, nullable: true})
  tasks: Task[];

  @OneToMany(() => UserChannel, userChannel => userChannel.user)
  userChannels: UserChannel[];

  @OneToMany(() => Message, message => message.sender)
  sentMessages: Message[];
  
  @OneToMany(() => Message, message => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Reply, reply => reply.sender)
  replies: Reply[];

    
}