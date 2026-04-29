import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SerializeDto } from '../common/interceptors/serialize-dto.interceptor';
import { AuthUser } from '../auth/auth-user.interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageExchangeResponseDto } from './dto/message-exchange-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessageService } from './message.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @SerializeDto(MessageExchangeResponseDto)
  create(@CurrentUser() user: AuthUser, @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(user.sub, createMessageDto);
  }

  @Get()
  @SerializeDto(MessageResponseDto)
  findAll(@CurrentUser() user: AuthUser, @Query('chatId') chatId?: string) {
    return this.messageService.findAll(user.sub, chatId);
  }

  @Get(':id')
  @SerializeDto(MessageResponseDto)
  async findOne(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    const message = await this.messageService.findOne(user.sub, id);

    if (!message) {
      throw new NotFoundException(`Message ${id} was not found`);
    }

    return message;
  }
}
