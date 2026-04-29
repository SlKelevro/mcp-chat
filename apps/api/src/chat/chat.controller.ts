import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SerializeDto } from "../common/interceptors/serialize-dto.interceptor";
import { AuthUser } from "../auth/auth-user.interface";
import { ChatResponseDto } from "./dto/chat-response.dto";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatService } from "./chat.service";

@Controller("chats")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @SerializeDto(ChatResponseDto)
  create(@CurrentUser() user: AuthUser, @Body() createChatDto: CreateChatDto) {
    return this.chatService.create(user.sub, createChatDto);
  }

  @Get()
  @SerializeDto(ChatResponseDto)
  findAll(@CurrentUser() user: AuthUser) {
    return this.chatService.findAll(user.sub);
  }

  @Get(":id")
  @SerializeDto(ChatResponseDto)
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    const chat = await this.chatService.findOne(user.sub, id);

    if (!chat) {
      throw new NotFoundException(`Chat ${id} was not found`);
    }

    return chat;
  }
}
