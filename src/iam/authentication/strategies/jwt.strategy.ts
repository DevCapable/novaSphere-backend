import jwtConfig from '../../../iam/config/jwt.config';
import { JwtPayload } from '../../../iam/interfaces';
import { UserRepository } from '../../../user/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findFirstBy(
      {
        email: payload.email,
      },
      [
        'accounts',
        'accounts.individual',
        'accounts.company',
        'accounts.operator',
        'accounts.agency',
        'roles',
        'roles.permissions',
        'permissions',
      ],
    );

    const accounts = user.accounts.map((account) => {
      return {
        id: account.id,
        uuid: account.uuid,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        name: account.name,
        nogicNumber: account.nogicNumber,
        type: account.type,
        bio: account.bio,
        oldId: account.oldId,
      };
    });

    return {
      ...user,
      accounts,
      session: payload.session,
      account: {
        id: payload.currentAccountId,
        type: payload.currentAccountType,
        agencyPosition: payload.currentAccountAgencyPosition,
      },
    };
  }
}
