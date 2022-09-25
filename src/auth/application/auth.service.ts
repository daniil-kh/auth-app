import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/application/users.service';
import { CreateUserDto } from '../../users/infrastructure/dto/user.dto';
import { AuthDto } from '../infrastructure/dto/auth.dto';
import { RedisCacheService } from '../../cache/application';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisCacheService: RedisCacheService,
  ) {}

  public async signin(data: AuthDto, userAgent: string) {
    const user = await this.userService.findOneByEmail(data.email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await this.comparePassword(
      data.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.generateTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    await this.defineAndSaveUserDevice(userAgent, user._id);

    return { user, ...tokens };
  }

  public async signup(createUserDto: CreateUserDto, userAgent: string) {
    const userExists = await this.userService.findOneByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPass = await this.hashData(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPass,
    });

    const { password, ...userResponse } = newUser.toObject();

    const tokens = await this.generateTokens(newUser._id, newUser.email);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    await this.defineAndSaveUserDevice(userAgent, newUser._id);

    return { user: userResponse, ...tokens };
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }

  private async generateTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async hashData(data) {
    const hash = await bcrypt.hash(data, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await this.comparePassword(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async defineAndSaveUserDevice(userAgent: string, userId: string) {
    const userDevices = await this.redisCacheService.get(
      JSON.stringify(userId),
    );

    if (userDevices) {
      if (!userDevices.includes(userAgent)) {
        await this.redisCacheService.set(JSON.stringify(userId), [
          ...userDevices,
          userAgent,
        ]);
      }
    } else {
      await this.redisCacheService.set(JSON.stringify(userId), [userAgent]);
    }
  }

  async getUserDevices(userId: string) {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const userDevices = await this.redisCacheService.get(
      JSON.stringify(user._id),
    );

    return userDevices;
  }
}
