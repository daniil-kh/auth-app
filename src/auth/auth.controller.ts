import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() dto: UserDto) {
    return dto;
  }
}
