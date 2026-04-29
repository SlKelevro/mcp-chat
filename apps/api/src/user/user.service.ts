import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UserFixture } from './user.type';
import { PasswordHasherService } from './password-hasher.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const password = await this.passwordHasher.hash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password,
    });
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

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async validateCredentials(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const matches = await this.passwordHasher.compare(password, user.password);
    return matches ? user : null;
  }

  async saveFixtures(users: UserFixture[]) {
    const updates: UserFixture[] = [];

    for (const user of users) {
      const password = await this.passwordHasher.hash(user.password);
      updates.push({
        ...user,
        email: user.email.toLowerCase(),
        password,
      });
    }

    await this.userRepository.upsert(updates, ['email']);
  }
}
