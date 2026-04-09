import { forwardRef, Inject, mixin, PipeTransform, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { accountTypeMapping } from '../account-type.mapping';
import { AccountRepository } from '../account.repository';
import { memoize } from '@nestjs/passport/dist/utils/memoize.util';
import { AccountTypeEnum } from '../enums';
import { CustomValidationException } from '@app/core/error';

export enum HandlerAction {
  CREATE,
  UPDATE,
}

export const AccountValidationPipe: (
  handlerAction: HandlerAction,
) => Type<PipeTransform<any, any>> = memoize(createAccountValidationPipe);

function createAccountValidationPipe(
  handlerAction: HandlerAction,
): Type<PipeTransform<any, any>> {
  handlerAction = !handlerAction ? HandlerAction.CREATE : handlerAction;

  class MixinAccountValidationPipe implements PipeTransform<any> {
    constructor(
      @Inject(forwardRef(() => AccountRepository))
      private accountRepository: AccountRepository,
    ) {}

    async transform(value: any) {
      try {
        let dto;
        let accountType;

        /* ----------------------------- CREATE FLOW ----------------------------- */
        if (handlerAction === HandlerAction.CREATE) {
          accountType = value.accountType as AccountTypeEnum;

          if (!accountType) {
            throw new CustomValidationException({
              accountType: 'Account type is required',
            });
          }

          if (!Object.values(AccountTypeEnum).includes(accountType)) {
            throw new CustomValidationException({
              accountType: `Account type can only be one of ${Object.values(
                AccountTypeEnum,
              ).join(', ')}`,
            });
          }

          if (!accountTypeMapping[accountType]) {
            throw new CustomValidationException({
              accountType: 'Invalid account type mapping',
            });
          }

          dto = accountTypeMapping[accountType].createDto;
        } else {
          /* ----------------------------- UPDATE FLOW ----------------------------- */
          const accountId = value.id;

          if (!accountId) {
            throw new CustomValidationException({
              accountType: 'Account ID is required',
            });
          }

          const account = await this.accountRepository.findById(+accountId);

          if (!account) {
            throw new CustomValidationException({
              accountId: 'Account not found',
            });
          }

          accountType = account.type;

          if (!accountTypeMapping[accountType]) {
            throw new CustomValidationException({
              accountType: 'Invalid account type mapping',
            });
          }

          dto = accountTypeMapping[accountType].updateDto;
        }

        /* ------------------------------ VALIDATION ----------------------------- */
        const object = plainToInstance(dto, value);
        const errors = await validate(object);

        if (errors.length > 0) {
          const errMsg = {};
          errors.forEach((err) => {
            errMsg[err.property] = Object.values(err.constraints || {});
          });

          throw new CustomValidationException(errMsg);
        }

        return { ...value, accountType };
      } catch (error: any) {
        // ✅ Preserve known validation errors
        if (error instanceof CustomValidationException) {
          throw error;
        }

        // ❗ Log for debugging
        console.error(
          'AccountValidationPipe Error:',
          error.response || error.message || error,
        );

        // ❗ Fallback error (avoid leaking internal details)
        throw new CustomValidationException({
          error: 'An unexpected error occurred during account validation',
        });
      }
    }
  }

  return mixin(MixinAccountValidationPipe);
}
