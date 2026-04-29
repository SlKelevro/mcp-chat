import { IsEnum, IsString, IsUUID, MinLength } from 'class-validator';
import { MessageRole } from '../message-role.enum';

export class CreateMessageDto {
  @IsUUID()
  chatId!: string;

  @IsEnum(MessageRole)
  // Only user messages should be sent by clients; assistant messages are created internally.
  role!: MessageRole;

  @IsString()
  @MinLength(1)
  content!: string;
}
