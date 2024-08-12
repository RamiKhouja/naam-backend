import { ChannelRole } from "../entities/user-channel.entity";

export class CreateUserChannelDto {
    userId: number;
    channelId: number;
    role: ChannelRole;
    is_archived?: boolean;
    is_favourite?: boolean;
}
