import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/application/users.service';
import { AccessTokenStrategy } from './application/accessToken.strategy';
import { RefreshTokenStrategy } from './application/refreshToken.strategy';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { DatabaseMongoModule } from 'src/databaseMongo/databaseMongo.module';

@Module({
  imports: [
    UsersModule,
    DatabaseMongoModule,
    JwtModule.register({}),
    CacheModule,
  ],
  providers: [
    AuthService,
    UsersService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ConfigService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
