import { Exclude } from 'class-transformer';
import { ChatEntity } from '../chat/chat.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MessageRole } from './message-role.enum';

@Entity({ name: 'messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid' })
  chatId!: string;

  @Column({
    type: 'enum',
    enum: MessageRole,
  })
  role!: MessageRole;

  @Column({ type: 'text' })
  content!: string;

  @Exclude()
  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatId' })
  chat!: ChatEntity;
}
