import { Injectable } from '@nestjs/common';
import { StatRepository } from './stat.repository';

@Injectable()
export class StatService {
  constructor(private readonly statRepository: StatRepository) {}
  async findStat(id) {
    return await this.statRepository.findStats(id);
  }
}
