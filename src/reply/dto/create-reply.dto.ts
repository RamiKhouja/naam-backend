export class CreateReplyDto {
    messageId: number;
    senderId: number;
    content: string;
    files?: string[];
  }
  