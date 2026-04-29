import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const message = this.messageRepository.create(createMessageDto);
    const savedMessage = await this.messageRepository.save(message);
    return this.findOneOrFail(savedMessage.id);
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

  private async findOneOrFail(id: number): Promise<MessageEntity> {
    const message = await this.findOne(id);

    if (!message) {
      throw new Error(`Message ${id} was not found after creation`);
    }

    return message;
  }
}
