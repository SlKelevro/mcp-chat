import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import appConfig from "./config/app.config";
import authConfig from "./config/auth.config";
import databaseConfig from "./config/database.config";
import llmConfig from "./config/llm.config";
import userConfig from "./config/user.config";
import { AuthModule } from "./auth/auth.module";
import { databaseModuleOptions } from "./config/database.module-options";
import { ChatModule } from "./chat/chat.module";
import { LlmModule } from "./llm/llm.module";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, llmConfig, userConfig],
      envFilePath: [".env.local", ".env"],
    }),
    TypeOrmModule.forRootAsync(databaseModuleOptions),
    AuthModule,
    LlmModule,
    UserModule,
    ChatModule,
    MessageModule,
  ],
})
export class AppModule {}
