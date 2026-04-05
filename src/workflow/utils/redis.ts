import IORedis from 'ioredis';
import { REDIS_KEY_PREFIXES } from '@app/redis/constants';

export function getUserTokenKey(username: string) {
  return `${REDIS_KEY_PREFIXES.WORKFLOW_TOKEN}:${username}`;
}

export function getAdminTokenKey() {
  return REDIS_KEY_PREFIXES.ADMIN_WORKFLOW_TOKEN;
}

export function getGroupStorageKey(
  filter: string,
  start: number,
  limit: number,
) {
  let key = '';
  if (filter) key += `filter:${filter}:`;
  key += `start:${start}:limit:${limit}`;
  return `${REDIS_KEY_PREFIXES.WORKFLOW_GROUP_KEY}:${key}`;
}

export async function deleteStoredGroups(redis: IORedis) {
  const pattern = REDIS_KEY_PREFIXES.WORKFLOW_GROUP_KEY + '*';
  let cursor = '0';

  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      100,
    );

    cursor = nextCursor;

    if (keys.length > 0) await redis.del(...keys);
  } while (cursor !== '0');
}
