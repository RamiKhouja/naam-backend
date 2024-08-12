import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

export enum ChannelRole {
    MEMBER = 'member',
    ADMIN = 'admin'
}

@Entity()
export class UserChannel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ChannelRole,
        default: ChannelRole.MEMBER,
    })
    role: ChannelRole;

    @Column({ default: false })
    is_archived: boolean;

    @Column({ default: false })
    is_favourite: boolean;

    @ManyToOne(() => User, user => user.userChannels)
    user: User;

    @ManyToOne(() => Channel, channel => channel.userChannels)
    channel: Channel;
}
