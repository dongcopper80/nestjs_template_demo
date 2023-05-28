import { CacheModule, Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

import {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    REDIS_TLS
} from './config/configuration';
import { RedisService } from './config/redis.service';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
        isGlobal: true,
        store: redisStore,
        url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
        password: REDIS_PASSWORD,
        ttl: REDIS_TLS
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})

export class RedisModule {}