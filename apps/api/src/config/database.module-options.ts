import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ChatEntity } from '../chat/chat.entity';
import { MessageEntity } from '../message/message.entity';
import { UserEntity } from '../user/user.entity';

export const databaseModuleOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres' as const,
    host: configService.getOrThrow<string>('database.host'),
    port: configService.getOrThrow<number>('database.port'),
    database: configService.getOrThrow<string>('database.database'),
    username: configService.getOrThrow<string>('database.username'),
    password: configService.getOrThrow<string>('database.password'),
    schema: configService.get<string>('database.schema', 'public'),
    synchronize: configService.get<boolean>('database.synchronize', false),
    autoLoadEntities: false,
    entities: [UserEntity, ChatEntity, MessageEntity],
  }),
};
