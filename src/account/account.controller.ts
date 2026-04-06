import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountTypeEnum } from './enums';
import { ApiFilterPagination } from '../core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '../core/providers/pagination/pagination.interceptor';
import { ApiEndpoint, FiltersQuery, PaginationQuery } from '../core/decorators';
import { ApiAccountCreate, ApiAccountUpdate } from './decorators';
import {
  AccountValidationPipe,
  HandlerAction,
} from './pipes/account-validation.pipe';
import { Accounts } from './decorators/accounts.decorator';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { EntityType } from '@app/audit-log/enum';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import type { Request } from 'express';
import { Public } from '@app/iam/decorators';
import { UpdateInstitutionDto } from '@app/account/dto';
import { IVendor } from './interface';

@Controller('accounts')
@ApiTags('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiQuery({
    name: 'type',
    type: 'string',
    required: true,
    enum: [...Object.keys(AccountTypeEnum)],
  })
  @ApiFilterPagination('Get all Accounts by account type')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.accountService.findAll(filterOptions, paginationOptions);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @ApiAccountCreate()
  @Post()
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  create(
    @Body(AccountValidationPipe(HandlerAction.CREATE))
    createAccountDto: CreateAccountDto,
  ) {
    return this.accountService.create({
      ...createAccountDto,
      isActivated: true,
    });
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @ApiAccountCreate()
  @Post('/institution')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  createInstitution(@Body() createInstitutionDto: any) {
    return this.accountService.createInstitution({
      ...createInstitutionDto,
      isActivated: true,
    });
  }

  // @Public()
  // @ApiAccountCreate()
  // @Post('/external')
  // createExternal(
  //   @Body(AccountValidationPipe(HandlerAction.CREATE))
  //   createAccountDto: CreateAccountDto,
  //   @Req() req: Request,
  // ) {
  //   const originApp = req.get('X-Origin-Application');
  //   const externalOrigin = ExternalLinkOriginEnum[originApp];
  //   return this.accountService.createExternal(
  //     {
  //       ...createAccountDto,
  //     },
  //     externalOrigin,
  //   );
  // }

  // @ApiEndpoint('find or create an account')
  // @Post('/find-create-account')
  // async matchOrCreateCompany(@Body() payload: IVendor[], @Req() req) {
  //   const originApp = req.get('X-Origin-Application');
  //   const externalOrigin = ExternalLinkOriginEnum[originApp];
  //   return await this.accountService.matchOrCreateCompany(
  //     payload,
  //     externalOrigin,
  //   );
  // }

  @Accounts(AccountTypeEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Get('/:id/stats')
  @ApiOperation({
    summary: 'Get Account Stats',
  })
  async findStats(@Param('id') id: number) {
    return await this.accountService.findStats(+id);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @ApiAccountUpdate()
  @Patch(':id')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @ApiAccountUpdate()
  @Patch('/institution/:id')
  updateInstitution(
    @Param('id') id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ) {
    return this.accountService.update(+id, updateInstitutionDto);
  }
}
