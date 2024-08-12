import { User } from "src/user/entities/user.entity";
import { Channel } from "../entities/channel.entity";
import { ChannelRole } from "src/user-channel/entities/user-channel.entity";

export class CreateChannelDto {
    name: string;
    description?: string;
    image?: string;
}

export class UserChannelInfoDto {
    channel: Channel;
    role: string;
    is_archived: boolean;
    is_favourite: boolean;
}

export class ChannelMemberInfoDto {
    user: User;
    role: ChannelRole;
}