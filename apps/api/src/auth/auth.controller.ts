import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SerializeDto } from '../common/interceptors/serialize-dto.interceptor';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { CurrentUser } from './current-user.decorator';
import { AuthUser } from './auth-user.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SerializeDto(AuthResponseDto)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @SerializeDto(UserResponseDto)
  me(@CurrentUser() user: AuthUser) {
    return this.authService.getCurrentUser(user.sub);
  }
}
