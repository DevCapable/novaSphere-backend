import { BaseRepository } from '@app/core/base/base.repository';
import { Injectable } from '@nestjs/common';
import { UserPassword } from './entities/user-password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserPasswordRepository extends BaseRepository<UserPassword> {
  public fillable: string[] = ['uuid', 'userId', 'expiryDate', 'password'];

  constructor(
    @InjectRepository(UserPassword)
    private readonly userPasswordRepository: Repository<UserPassword>,
  ) {
    super(userPasswordRepository);
  }

  async create(
    { userId, expiryDate, password },
    entityManager?: EntityManager,
  ) {
    const manager =
      entityManager?.getRepository(UserPassword) || this.userPasswordRepository;
    return manager.save({
      userId,
      expiryDate,
      password,
      uuid: uuidv4(),
    });
  }
}
