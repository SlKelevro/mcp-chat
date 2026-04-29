import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { SerializeDto } from "../common/interceptors/serialize-dto.interceptor";
import { ChatResponseDto } from "./dto/chat-response.dto";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatService } from "./chat.service";

@Controller("chats")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @SerializeDto(ChatResponseDto)
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  @SerializeDto(ChatResponseDto)
  findAll() {
    return this.chatService.findAll();
  }

  @Get(":id")
  @SerializeDto(ChatResponseDto)
  async findOne(@Param("id") id: string) {
    const chat = await this.chatService.findOne(id);

    if (!chat) {
      throw new NotFoundException(`Chat ${id} was not found`);
    }

    return chat;
  }
}
