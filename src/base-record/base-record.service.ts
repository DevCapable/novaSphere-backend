import { Injectable, Logger } from '@nestjs/common';
import { BaseRecordRepository } from './base-record.repository';
import { v4 as uuidv4 } from 'uuid';
import { CustomBadRequestException } from '@app/core/error';
import { APP_REDIS } from '@app/redis/constants';
import IORedis from 'ioredis';
import { InjectRedisConnection } from '@app/redis/decorators';
import { BaseRecordEnum } from '@app/base-record/entities/base-record.entity';

@Injectable()
export class BaseRecordService {
  private readonly logger = new Logger(BaseRecordService.name);
  private readonly CACHE_TTL = 60 * 60 * 24 * 7; // 7 days
  private readonly CACHE_PREFIX = 'base-records:';

  constructor(
    private readonly baseRecordRepository: BaseRecordRepository,
    @InjectRedisConnection(APP_REDIS)
    private redis: IORedis,
  ) {}

  /*
  async findAll(filterOptions, paginationOptions) {
    await this.clearCacheByType(BaseRecordEnum.LGA);

    const filterKey = `${JSON.stringify(filterOptions)}:${JSON.stringify(paginationOptions)}`;

    let cacheKey = `${this.CACHE_PREFIX}all:${filterKey}`;

    if (filterOptions.type)
      cacheKey = `${this.CACHE_PREFIX}type:${filterOptions.type}:all:${filterKey}`;

    try {
      const cachedData = await this.redis.get(cacheKey);
      if (cachedData) return JSON.parse(cachedData);
    } catch (error) {
      this.logger.error(`Error retrieving from cache: ${error.message}`);
    }

    const [data, totalCount] = await this.baseRecordRepository.findAll(
      filterOptions,
      paginationOptions,
    );

    const result = { data, totalCount };

    try {
      await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(result));
    } catch (error) {
      this.logger.error(`Error saving to cache: ${error.message}`);
    }

    return result;
  }
  */
  async findAll(filterOptions, paginationOptions) {
    try {
      const [data, totalCount] = await this.baseRecordRepository.findAll(
        filterOptions,
        paginationOptions,
      );

      return { data, totalCount };
    } catch (error: any) {
      this.logger.error(`Error fetching records: ${error.message}`);
      throw new Error('Failed to retrieve records');
    }
  }

  async findOrCreate(data): Promise<any> {
    if (data && data.name) {
      const baseRecordData = {
        ...data,
        name: data.name.toUpperCase(),
      };

      return this.baseRecordRepository.findOrCreate(baseRecordData);
    } else {
      throw new CustomBadRequestException(
        'Invalid data object or missing "name" property for find or create for base record',
      );
    }
  }

  async create(data) {
    const baseRecordData = {
      ...data,
      uuid: uuidv4(),
      name: data.name.toUpperCase(),
    };

    const result = this.baseRecordRepository.create(baseRecordData);

    if (data.type) {
      await this.clearCacheByType(data.type);
    }

    return result;
  }

  async findOne(id: number) {
    return this.baseRecordRepository.findById(id);
  }

  async update(id: number, data) {
    const currentRecord = await this.baseRecordRepository.findById(id);

    const baseRecordData = {
      ...data,
      name: data.name.toUpperCase(),
    };

    const result = await this.baseRecordRepository.update(id, baseRecordData);

    const recordType = data.type || currentRecord?.type;

    if (recordType) {
      await this.clearCacheByType(recordType);

      if (data.type && currentRecord && data.type !== currentRecord.type) {
        await this.clearCacheByType(currentRecord.type);
      }
    }

    return result;
  }

  async delete(id: number) {
    const record = await this.baseRecordRepository.findById(id);
    const result = await this.baseRecordRepository.delete(id);

    if (record?.type) {
      await this.clearCacheByType(record.type);
    }

    return result;
  }

  private async clearCacheByType(type: string): Promise<void> {
    try {
      const stream = this.redis.scanStream({
        match: `${this.CACHE_PREFIX}type:${type}:*`,
        count: 100,
      });

      const keysToDelete: string[] = [];

      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          keysToDelete.push(...keys);
        }
      });

      await new Promise((resolve) => stream.on('end', resolve));

      if (keysToDelete.length > 0) await this.redis.del(keysToDelete);

      // Also clear any general queries that might not have a type specified
      const genericStream = this.redis.scanStream({
        match: `${this.CACHE_PREFIX}all:*`,
        count: 100,
      });

      const genericKeysToDelete: string[] = [];

      genericStream.on('data', (keys: string[]) => {
        if (keys.length) {
          genericKeysToDelete.push(...keys);
        }
      });

      await new Promise((resolve) => genericStream.on('end', resolve));

      if (genericKeysToDelete.length > 0)
        await this.redis.del(genericKeysToDelete);
    } catch (error: any) {
      this.logger.error(
        `Failed to clear cache for type ${type}: ${error.message}`,
      );
    }
  }
}
