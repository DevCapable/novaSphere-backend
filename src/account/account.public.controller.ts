import { Public } from '../iam/decorators';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { ApiEndpoint, FiltersQuery, PaginationQuery } from '../core/decorators';
import { ApiFilterPagination } from '../core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '../core/providers/pagination/pagination.interceptor';
import { AccountTypeEnum } from './enums';

@Controller('accounts-public')
@Public()
@ApiTags('accounts-public')
export class AccountPublicController {
  constructor(private readonly accountService: AccountService) {}

  @ApiQuery({
    name: 'type',
    type: 'string',
    required: true,
    enum: [...Object.keys(AccountTypeEnum)],
  })
  @ApiFilterPagination('Get all Accounts by account type for public')
  @UseInterceptors(PaginationInterceptor)
  @Get('')
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    delete filterOptions.accountId;
    filterOptions.isPublic = true;
    return await this.accountService.findAll(filterOptions, paginationOptions);
  }
}
