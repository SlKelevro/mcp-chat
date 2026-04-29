import { Injectable } from '@nestjs/common';
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

  async create(createChatDto: CreateChatDto): Promise<ChatEntity> {
    const chat = this.chatRepository.create(createChatDto);
    const savedChat = await this.chatRepository.save(chat);
    return this.findOneOrFail(savedChat.id);
  }

  async findAll(): Promise<ChatEntity[]> {
    return this.chatRepository.find({
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<ChatEntity | null> {
    return this.chatRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  private async findOneOrFail(id: string): Promise<ChatEntity> {
    const chat = await this.findOne(id);

    if (!chat) {
      throw new Error(`Chat ${id} was not found after creation`);
    }

    return chat;
  }
}
