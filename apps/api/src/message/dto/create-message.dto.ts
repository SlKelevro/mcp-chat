import { IsEnum, IsString, IsUUID, MinLength } from 'class-validator';
import { MessageRole } from '../message-role.enum';

export class CreateMessageDto {
  @IsUUID()
  chatId!: string;

  @IsEnum(MessageRole)
  role!: MessageRole;

  @IsString()
  @MinLength(1)
  content!: string;
}
