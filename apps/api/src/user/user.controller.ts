import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SerializeDto } from '../common/interceptors/serialize-dto.interceptor';
import { AuthUser } from '../auth/auth-user.interface';
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
  @UseGuards(JwtAuthGuard)
  @SerializeDto(UserResponseDto)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @SerializeDto(UserResponseDto)
  async findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    if (user.sub !== id) {
      throw new NotFoundException(`User ${id} was not found`);
    }

    const foundUser = await this.userService.findOne(id);

    if (!foundUser) {
      throw new NotFoundException(`User ${id} was not found`);
    }

    return foundUser;
  }
}
