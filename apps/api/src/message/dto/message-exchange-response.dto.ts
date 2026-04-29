import { Expose, Type } from 'class-transformer';
import { MessageResponseDto } from './message-response.dto';

export class MessageExchangeResponseDto {
  @Expose()
  @Type(() => MessageResponseDto)
  userMessage!: MessageResponseDto;

  @Expose()
  @Type(() => MessageResponseDto)
  assistantMessage!: MessageResponseDto | null;
}
