import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SerializeDto } from '../common/interceptors/serialize-dto.interceptor';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageExchangeResponseDto } from './dto/message-exchange-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @SerializeDto(MessageExchangeResponseDto)
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  @SerializeDto(MessageResponseDto)
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  @SerializeDto(MessageResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const message = await this.messageService.findOne(id);

    if (!message) {
      throw new NotFoundException(`Message ${id} was not found`);
    }

    return message;
  }
}
