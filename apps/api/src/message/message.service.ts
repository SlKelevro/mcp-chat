import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(createMessageDto: CreateMessageDto): Promise<{
    userMessage: MessageEntity;
    assistantMessage: MessageEntity | null;
  }> {
    if (createMessageDto.role !== MessageRole.User) {
      throw new BadRequestException('Only user messages can be created directly');
    }

    const chat = await this.chatRepository.findOne({
      where: { id: createMessageDto.chatId },
    });

    if (!chat) {
      throw new BadRequestException(`Chat ${createMessageDto.chatId} was not found`);
    }

    const userMessage = await this.saveMessage(createMessageDto);
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

  async findAll(): Promise<MessageEntity[]> {
    return this.messageRepository.find({
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

  async findOne(id: number): Promise<MessageEntity | null> {
    return this.messageRepository.findOne({
      where: { id },
      relations: {
        chat: {
          user: true,
        },
      },
    });
  }

  private async saveMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
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
    const message = await this.findOne(id);

    if (!message) {
      throw new Error(`Message ${id} was not found after creation`);
    }

    return message;
  }
}
