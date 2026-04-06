import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateStaffDto } from './dto';

import { StaffService } from './staff.service';
import { AccountTypeEnum } from '@app/account/enums';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { EntityType } from '@app/audit-log/enum';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { MultiDeleteStaffDto } from './dto/multi-delete-staff.dto';
import { MultiUnarchiveStaffDto } from './dto/multi-restore-staff';

@Controller('staffs')
@ApiTags('staffs')
@UseInterceptors(
  AuditLogInterceptor({
    entityType: EntityType.STAFF,
    service: StaffService,
  }),
)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 200,
    description: 'staff created successfully',
  })
  @Post()
  async create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.createStaff(createStaffDto);
  }

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @ApiFilterPagination('Get all staffs')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.staffService.findAll(filterOptions, paginationOptions);
  }

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @ApiFilterPagination('Get all user that dont belong to any institution')
  @UseInterceptors(PaginationInterceptor)
  @Get('/individuals')
  async findAllIndividuals(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.staffService.findIndividuals(
      filterOptions,
      paginationOptions,
    );
  }

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get a Staff Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.staffService.findOne(id);
  }

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unarchive All Staff Record',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch('/unarchive')
  async unarchiveAll(@Body() staffData: MultiUnarchiveStaffDto) {
    return this.staffService.unarchiveAll(staffData);
  }

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unarchive Staff Record',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch('/unarchive/:id')
  async unarchive(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.unarchive(id);
  }

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Staff Record',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data) {
    return this.staffService.update(id, data);
  }

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Multi Delete Staff Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete('')
  multiRemove(@Body() staffData: MultiDeleteStaffDto) {
    return this.staffService.multiDelete(staffData);
  }

  @Accounts(AccountTypeEnum.INSTITUTION, AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete Staff Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteStaff(+id);
  }
}
