import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CurrentUser, Public } from '@app/iam/decorators';
import { AccountTypeEnum } from '@app/account/enums';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';

@ApiTags('audit-logs')
@Controller('audit-logs')
@Accounts(
  AccountTypeEnum.AGENCY,
  AccountTypeEnum.OPERATOR,
  AccountTypeEnum.COMPANY,
)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @ApiFilterPagination('Get all logs')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
    @CurrentUser() user,
  ) {
    return this.auditLogService.findAll(filterOptions, paginationOptions, user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Log')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.auditLogService.findOne(+id);
  }

  @Public()
  @Get()
  async generateEncryptionKey() {
    return await this.auditLogService._generateEncryptionKey();
  }
}
