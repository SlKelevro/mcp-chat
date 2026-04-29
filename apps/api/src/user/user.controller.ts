import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { SerializeDto } from '../common/interceptors/serialize-dto.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @SerializeDto(UserResponseDto)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @SerializeDto(UserResponseDto)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @SerializeDto(UserResponseDto)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User ${id} was not found`);
    }

    return user;
  }
}
