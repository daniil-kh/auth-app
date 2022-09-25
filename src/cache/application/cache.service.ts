import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { RedisClient } from 'redis';
import { RedisCache } from '../infrasctructure/interfaces';

@Injectable()
export class RedisCacheService {
  private redisClient: RedisClient;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {
    this.redisClient = this.cacheManager.store.getClient();
  }

  async get(key): Promise<any> {
    const asyncGet = new Promise((resolve, reject) => {
      this.redisClient.get(key, (e, data) => {
        if (e) {
          reject(e);
        }
        resolve(data);
      });
    });

    const val = await asyncGet.then((val) => val);

    return val;
  }

  async set(key, value) {
    const asyncSet = new Promise((resolve, reject) => {
      this.redisClient.set(key, value, (e, data) => {
        if (e) {
          reject(e);
        }
        resolve(data);
      });
    });

    await asyncSet.then((val) => val);
  }
}
