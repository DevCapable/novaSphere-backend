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
    // 1. Fetch user with all academic and organizational relations
    const user = await this.userRepository.findFirstBy(
      {
        email: payload.email,
      },
      [
        'accounts',
        'accounts.individual',
        'accounts.institution', // University/Polytechnic data
        'accounts.sug', // Student Union data
        'accounts.admin', // Staff/Admin data
        'accounts.operator', // Legacy or Corporate partners
        'accounts.communityVendor', // Campus businesses
        'roles',
        'roles.permissions',
        'permissions',
      ],
    );

    if (!user) {
      return null;
    }

    // 2. Transform accounts for the Request object
    const accounts = user.accounts.map((account) => {
      return {
        id: account.id,
        uuid: account.uuid,
        name: account.name,
        type: account.type,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      };
    });

    // 3. Return the payload that will be attached to Request.user
    return {
      ...user,
      accounts,
      session: payload.session,
      // Identify the current active profile context
      activeAccount: {
        id: payload.currentAccountId,
        type: payload.currentAccountType,
        // Optional: specific fields for Administrative roles
        position: payload.currentAccountAdminPosition,
      },
    };
  }
}
