// src/lib/kv.ts
import { Redis } from '@upstash/redis';

// Using `Redis.fromEnv()` automatically reads
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from your environment
const kv = Redis.fromEnv();

export default kv;