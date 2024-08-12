import { Message } from 'src/message/entities/message.entity';
import { UserChannel } from 'src/user-channel/entities/user-channel.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';


@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    image: string;

    @OneToMany(() => UserChannel, userChannel => userChannel.channel)
    userChannels: UserChannel[];

    @OneToMany(() => Message, message => message.channel)
    messages: Message[];

}
