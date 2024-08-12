export class CreateMessageDto {
    senderId: number;
    receiverId?: number;
    channelId?: number;
    content: string;
    files?: string[];
}
  