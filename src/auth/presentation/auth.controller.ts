import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/core/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/core/guards/refreshToken.guard';
import { CreateUserDto } from '../../users/infrastructure/dto/user.dto';
import { AuthService } from '../application/auth.service';
import { AuthDto } from '../infrastructure/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(
    @Body() createUserDto: CreateUserDto,
    @Headers() headers: Record<string, string>,
  ) {
    return this.authService.signup(createUserDto, headers['user-agent']);
  }

  @Post('signin')
  signin(@Body() data: AuthDto, @Headers() headers: Record<string, string>) {
    return this.authService.signin(data, headers['user-agent']);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-user-devices')
  getUserDevices(@Req() req: any) {
    const userId = req.user['sub'];

    return this.authService.getUserDevices(userId);
  }
}
