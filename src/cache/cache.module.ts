import { Module } from '@nestjs/common';
import { CacheModule as CommonCacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './application/cache.service';

@Module({
  imports: [
    CommonCacheModule.registerAsync({
      useFactory: async () => ({
        isGlobal: true,
        store: redisStore,
        host: 'redis_cache',
        port: 6379,
        url: 'redis://redis_cache:6379/1',
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class CacheModule {}
