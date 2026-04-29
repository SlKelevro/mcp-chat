import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from '../chat/chat.entity';
import { LlmHandlerRegistry } from '../llm/llm-handler.registry';
import { LlmMessage } from '../llm/llm-handler.interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './message.entity';
import { MessageRole } from './message-role.enum';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly llmHandlerRegistry: LlmHandlerRegistry,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, createMessageDto: CreateMessageDto): Promise<{
    userMessage: MessageEntity;
    assistantMessage: MessageEntity | null;
  }> {
    const chat = await this.findChatForUser(userId, createMessageDto.chatId);

    if (!chat) {
      throw new NotFoundException(`Chat ${createMessageDto.chatId} was not found`);
    }

    const userMessage = await this.saveMessage({
      chatId: createMessageDto.chatId,
      role: MessageRole.User,
      content: createMessageDto.content,
    });
    const history = await this.buildChatHistory(chat.id);
    const handlerType = this.configService.getOrThrow<string>('llm.handlerType');
    const handler = this.llmHandlerRegistry.get(handlerType);
    const assistantContent = await handler.complete(history);
    const assistantMessage = await this.saveMessage({
      chatId: chat.id,
      role: MessageRole.Assistant,
      content: assistantContent,
    });

    return {
      userMessage,
      assistantMessage,
    };
  }

  async findAll(userId: string, chatId?: string): Promise<MessageEntity[]> {
    if (chatId) {
      const chat = await this.findChatForUser(userId, chatId);

      if (!chat) {
        throw new NotFoundException(`Chat ${chatId} was not found`);
      }
    }

    const chats = await this.chatRepository.find({
      where: { userId },
      select: { id: true },
    });
    const allowedChatIds = chats.map((chat) => chat.id);

    if (allowedChatIds.length === 0) {
      return [];
    }

    return this.messageRepository.find({
      where: chatId
        ? { chatId }
        : allowedChatIds.map((allowedChatId) => ({ chatId: allowedChatId })),
      relations: {
        chat: {
          user: true,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(userId: string, id: number): Promise<MessageEntity | null> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: {
        chat: {
          user: true,
        },
      },
    });

    if (!message || message.chat.userId !== userId) {
      return null;
    }

    return message;
  }

  private async saveMessage(createMessageDto: {
    chatId: string;
    role: MessageRole;
    content: string;
  }): Promise<MessageEntity> {
    const message = this.messageRepository.create(createMessageDto);
    const savedMessage = await this.messageRepository.save(message);
    return this.findOneOrFail(savedMessage.id);
  }

  private async buildChatHistory(chatId: string): Promise<LlmMessage[]> {
    const messages = await this.messageRepository.find({
      where: { chatId },
      order: {
        createdAt: 'ASC',
        id: 'ASC',
      },
    });

    return messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }

  private async findOneOrFail(id: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: {
        chat: {
          user: true,
        },
      },
    });

    if (!message) {
      throw new Error(`Message ${id} was not found after creation`);
    }

    return message;
  }

  private async findChatForUser(userId: string, chatId: string): Promise<ChatEntity | null> {
    return this.chatRepository.findOne({
      where: {
        id: chatId,
        userId,
      },
    });
  }
}
