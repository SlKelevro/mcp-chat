import { Exclude } from 'class-transformer';
import { ChatEntity } from '../chat/chat.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  displayName!: string;

  @Exclude()
  @CreateDateColumn()
  createdAt!: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ChatEntity, (chat) => chat.user)
  chats!: ChatEntity[];
}
