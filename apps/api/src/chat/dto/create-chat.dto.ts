import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;
}
