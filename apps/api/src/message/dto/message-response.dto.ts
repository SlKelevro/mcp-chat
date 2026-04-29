import { Expose, Type } from 'class-transformer';
import { ChatResponseDto } from '../../chat/dto/chat-response.dto';
import { MessageRole } from '../message-role.enum';

export class MessageResponseDto {
  @Expose()
  id!: number;

  @Expose()
  chatId!: string;

  @Expose()
  role!: MessageRole;

  @Expose()
  content!: string;

  @Expose()
  @Type(() => ChatResponseDto)
  chat!: ChatResponseDto;
}
