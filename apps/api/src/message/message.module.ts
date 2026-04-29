import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from '../chat/chat.entity';
import { ChatModule } from '../chat/chat.module';
import { LlmModule } from '../llm/llm.module';
import { MessageEntity } from './message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, ChatEntity]), ChatModule, LlmModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService, TypeOrmModule],
})
export class MessageModule {}
