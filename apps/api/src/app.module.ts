import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import appConfig from "./config/app.config";
import databaseConfig from "./config/database.config";
import llmConfig from "./config/llm.config";
import userConfig from "./config/user.config";
import { databaseModuleOptions } from "./config/database.module-options";
import { ChatModule } from "./chat/chat.module";
import { LlmModule } from "./llm/llm.module";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, llmConfig, userConfig],
      envFilePath: [".env.local", ".env"],
    }),
    TypeOrmModule.forRootAsync(databaseModuleOptions),
    LlmModule,
    UserModule,
    ChatModule,
    MessageModule,
  ],
})
export class AppModule {}
