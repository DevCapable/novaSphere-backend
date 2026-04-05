import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager, In, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import {
  buildFillable,
  buildRelations,
  buildSearchQueryBuilder,
  generateRandomCode,
} from '../core/util';
import { BaseRepository } from '@app/core/base/base.repository';
import { User } from './entities/user.entity';
import { Role } from '@app/role/entities/role.entity';
import { Account } from '@app/account/entities/account.entity';
import { LoginAttempt } from './entities/login-attempt.entity';
import { v4 as uuidv4 } from 'uuid';
import { PasswordMigrationException } from '@app/core/error/migration-error';
import { LoggerService } from '@app/logger';
import { CustomUnauthorizedException } from '@app/core/error';
import { Permission } from '@app/permission/entities/permission.entity';
@Injectable()
export class UserRepository extends BaseRepository<User> {
  public readonly maxAttempts: number = 5;
  private readonly timeframe: number = 15 * 60 * 1000;

  public fillable: string[] = [
    'firstName',
    'lastName',
    'password',
    'isFirstLogin',
    'isPasswordReset',
    'isTermsAccepted',
    'accounts',
    'lastLogin',
    'isActivated',
    'email',
    'roles',
    'nogicNumber',
    'wfUserId',
    'wfUserPassword',
    'wfUserGroups',
    'uuid',
    'hashedRt',
    'permissions',
  ];

  public searchable = ['firstName', 'lastName', 'email'];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly entityManager: EntityManager,
    private readonly loggerService: LoggerService,
    @InjectRepository(LoginAttempt)
    private loginAttemptRepository: Repository<LoginAttempt>,
  ) {
    super(userRepository);
  }

  async create(
    {
      firstName,
      lastName,
      email,
      password,
      accounts,
      isActivated,
      roles,
      wfUserGroups,
    },
    entityManager?: EntityManager,
  ): Promise<User> {
    try {
      const manager = entityManager?.getRepository(User) || this.userRepository;

      const existingUser = await manager.findOne({
        where: {
          email,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }

      password = password ? password : 'password';
      const _hashedPassword = await this.hashingService.hash(password);

      const nogicNumber = generateRandomCode(8);

      const createData = {
        firstName,
        lastName,
        email,
        password: _hashedPassword,
        nogicNumber,
        isActivated,
        wfUserGroups,
        ...(roles && { roles }),
        ...(accounts && { accounts }),
      };
      const newEntity = await this._prepareEntity(createData, manager);
      const newUser = await manager.save({ ...newEntity, uuid: uuidv4() });
      return { ...newUser, password: _hashedPassword, _raw: password };
    } catch (error: any) {
      this.loggerService.log(error);
      throw error;
    }
  }

  async login(email, password) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['accounts', 'accounts.agency'],
    });
    const failedAttempts = await this._countRecentFailedAttempts(email);

    if (!user) {
      return null;
    }

    if (user.password === null) {
      throw new PasswordMigrationException(email);
    }

    if (!user.isActivated && failedAttempts >= this.maxAttempts) {
      throw new CustomUnauthorizedException(
        'Your account has been temporarily locked due to multiple unsuccessful login attempts. Please contact customer support for assistance or try again later.',
      );
    }

    const isEqual = await this.hashingService.compare(password, user.password);

    if (isEqual) {
      await this._logAttempt(email, true);
      return user;
    } else {
      await this._logAttempt(email, false);
    }

    if (failedAttempts >= this.maxAttempts) {
      await this._deactivateAccount(email);
      throw new CustomUnauthorizedException(
        'Your account has been temporarily locked due to multiple unsuccessful login attempts. Please contact customer support for assistance or try again later.',
      );
    }

    return null;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await this.hashingService.hash(refreshToken);
    await this.update(userId, {
      hashedRt: hash,
    });
  }

  async findAll(
    filterOptions: {
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
      [key: string]: any;
    } = {},
    paginationOptions: { skip?: number; limit?: number } = {},
    relations: string[] = [],
  ): Promise<[User[], number]> {
    const { sortKey, sortDir, ids, filterAccountId, ...searchOptions } =
      filterOptions;
    if (filterAccountId) {
      searchOptions.accountId = filterAccountId;
    }
    const { skip, limit } = paginationOptions;
    let queryBuilder = this.repository.createQueryBuilder('entity');
    const usedRelations = relations.length ? relations : this.relations;
    buildRelations(queryBuilder, usedRelations);

    if (ids) {
      const idArray = ids.split(',').map((id) => parseInt(id.trim(), 10));
      queryBuilder.andWhere('entity.id IN (:...idArray)', { idArray });
    }

    if (limit) {
      queryBuilder.take(limit);
    }

    if (skip) {
      queryBuilder.skip(skip);
    }

    if (sortKey) {
      queryBuilder.orderBy(`entity.${sortKey}`, sortDir || 'ASC');
    }

    buildSearchQueryBuilder(searchOptions, this.searchable, queryBuilder, [
      'account',
    ]);

    queryBuilder = this._findAll(queryBuilder, searchOptions);
    try {
      const [data, totalCount] = await queryBuilder.getManyAndCount();
      return [data, totalCount];
    } catch (error: any) {
      let message: string;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      const err: any = new Error(message);
      this.loggerService.error('Error executing SQL query:', err);
      throw err;
    }
  }

  async findFirstBy(
    options: Record<string, any>,
    relations = [
      'accounts',
      'accounts.agency',
      'roles',
      'roles.permissions',
      'permissions',
    ],
  ) {
    return this.userRepository.findOne({
      where: options,
      relations,
    });
  }

  backgroundProcess(payload: any) {
    this.loggerService.log(payload);
  }

  async deleteUser(id) {
    const dateNow = new Date();
    return this.userRepository.save({
      id,
      deletedAt: dateNow,
    });
  }

  async update(id: number, data, entityManager?: EntityManager) {
    const manager = entityManager
      ? entityManager.getRepository(User)
      : this.userRepository;

    const entity = await this._prepareEntity(data, manager, id);
    await manager.save(entity);
    return await manager.findOne({
      where: { id: id as any },
      relations: this.relations,
    });
  }

  async _prepareEntity(data: any, manager: any, id?: number | null) {
    const payload = buildFillable(data, this.fillable);

    let roles: Role[] = [];
    let accounts: Account[] = [];
    let permissions: Permission[] = [];

    const transactionalManager = manager.manager;

    if (data.roles) {
      roles = await transactionalManager.findBy(Role, {
        id: In(data.roles),
      });
    }

    if (data.accounts) {
      accounts = await transactionalManager.findBy(Account, {
        id: In(data.accounts),
      });
    }

    if (data.permissions) {
      permissions = await transactionalManager.findBy(Permission, {
        id: In(data.permissions),
      });
    }

    return manager.create({
      ...payload,
      ...(id && { id }),
      ...(roles.length && { roles }),
      ...(accounts.length && { accounts }),
      ...(permissions.length && { permissions }),
    });
  }

  async _logAttempt(username: string, isSuccess: boolean): Promise<void> {
    const attempt = this.loginAttemptRepository.create({
      username,
      isSuccess,
    });
    await this.loginAttemptRepository.save(attempt);
  }

  async _countRecentFailedAttempts(username: string): Promise<number> {
    const since = new Date(Date.now() - this.timeframe);
    return this.loginAttemptRepository.count({
      where: {
        username,
        isSuccess: false,
        createdAt: MoreThan(since),
      },
    });
  }

  async _deactivateAccount(username: string): Promise<void> {
    const user = await this.findFirst({ email: username });
    if (user) {
      user.isActivated = false;
      await this.userRepository.update(user.id, user);
    }
  }

  getBaseRepository() {
    return this.userRepository;
  }
}
