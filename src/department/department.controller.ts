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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import {
  ICreateDepartmentDto,
  IUpdateDepartmentDto,
} from './department.interface';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AccountTypeEnum } from '@app/account/enums/account-type.enum';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { EntityType } from '@app/audit-log/enum';
import { AccountService } from '@app/account/account.service';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @ApiTags('account')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({
    status: 201,
    description: 'The department has been successfully created.',
  })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @ApiTags('account')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  @Get()
  @ApiOperation({ summary: 'Retrieve all departments' })
  findAll() {
    return this.departmentService.findAll();
  }

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @ApiTags('account')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a department by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findOne(id);
  }

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @ApiTags('account')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  @Patch(':id')
  @ApiOperation({ summary: 'Update a department by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Accounts(
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.SUG,
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.COMMUNITY_VENDOR,
  )
  @ApiTags('account')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.remove(id);
  }
}
