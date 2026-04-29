import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class ChatResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  userId!: string;

  @Expose()
  @Type(() => UserResponseDto)
  user!: UserResponseDto;
}
