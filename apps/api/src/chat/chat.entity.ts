import { Exclude } from 'class-transformer';
import { MessageEntity } from '../message/message.entity';
import { UserEntity } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Exclude()
  @CreateDateColumn()
  createdAt!: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.chats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages!: MessageEntity[];
}
