import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LecturerService } from './lecturer.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AccountTypeEnum } from '@app/account/enums/account-type.enum';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { EntityType } from '@app/audit-log/enum';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';

@ApiTags('Departments')
@Controller('departments')
@ApiBearerAuth()
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.DEPARTMENT,
      service: LecturerService,
    }),
  )
  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({
    status: 201,
    description: 'The department has been successfully created.',
  })
  create(@Body() createDepartmentDto: any) {
    return this.lecturerService.create(createDepartmentDto);
  }

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @ApiFilterPagination('Retrieve all departments')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.lecturerService.findAll(filterOptions, paginationOptions);
  }

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a department by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lecturerService.findOne(id);
  }

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.DEPARTMENT,
      service: LecturerService,
    }),
  )
  @Patch(':id')
  @ApiOperation({ summary: 'Update a department by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: any,
  ) {
    return this.lecturerService.update(id, updateDepartmentDto);
  }

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.DEPARTMENT,
      service: LecturerService,
    }),
  )
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lecturerService.remove(id);
  }
}
