import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatEntity } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  async create(userId: string, createChatDto: CreateChatDto): Promise<ChatEntity> {
    const chat = this.chatRepository.create({
      ...createChatDto,
      userId,
    });
    const savedChat = await this.chatRepository.save(chat);
    return this.findOneOrFail(savedChat.id);
  }

  async findAll(userId: string): Promise<ChatEntity[]> {
    return this.chatRepository.find({
      where: { userId },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(userId: string, id: string): Promise<ChatEntity | null> {
    return this.chatRepository.findOne({
      where: { id, userId },
      relations: {
        user: true,
      },
    });
  }

  async findOneOrThrow(userId: string, id: string): Promise<ChatEntity> {
    const chat = await this.findOne(userId, id);

    if (!chat) {
      throw new NotFoundException(`Chat ${id} was not found`);
    }

    return chat;
  }

  private async findOneOrFail(id: string): Promise<ChatEntity> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!chat) {
      throw new Error(`Chat ${id} was not found after creation`);
    }

    return chat;
  }
}
