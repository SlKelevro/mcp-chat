import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import {UserFixture} from "./user.type";
import {PasswordHasherService} from "./password-hasher.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private passwordHasher: PasswordHasherService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async saveFixtures(users: UserFixture[]) {
      console.log(`Saving ${users.length} user fixtures...`);

      const updates: UserFixture[] = [];

      for (const user of users) {
          const password = await this.passwordHasher.hash(user.password);
          updates.push(
              {...user, password}
          )
      }

      await this.userRepository.upsert(updates, ['email']);
  }
}
