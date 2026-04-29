import {Module, OnModuleInit} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {ConfigService} from "@nestjs/config";
import {PasswordHasherService} from "./password-hasher.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, PasswordHasherService],
  exports: [UserService, TypeOrmModule, PasswordHasherService],
})
export class UserModule implements OnModuleInit {
    constructor(private readonly userService: UserService, private readonly config: ConfigService) {}
    async onModuleInit(): Promise<void> {
        const users = this.config.get('users') ?? [];

        if (Array.isArray(users) && users.length > 0) {
            await this.userService.saveFixtures(users);
        }
    }
}
