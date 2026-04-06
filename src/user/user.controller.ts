import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Accounts } from '../account/decorators/accounts.decorator';
import { Permission } from '@app/iam/authorization/decorators';
import { AccountTypeEnum } from '../account/enums';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiEndpoint, FiltersQuery, PaginationQuery } from '../core/decorators';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiFilterPagination } from '../core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '../core/providers/pagination/pagination.interceptor';
import ResetPasswordDto from './dto/reset-user-password.dto';
import { ChangePasswordDto } from '../iam/authentication/dto';
import { ApiEndPoint } from '@app/core/interface/api-endpoint.interface';
import { CreateUserFromStaffDto } from './dto/create-user-from-staff.dto';
import { CurrentUser, Public } from '@app/iam/decorators';
import type { CurrentUserData } from '@app/iam/interfaces';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { AuditAction, EntityType } from '@app/audit-log/enum';
import {
  PermisionActionTypeEnum,
  PermisionSubjectTypeEnum,
} from '@app/iam/enum/permission.enum';
import type { Request } from 'express';
import type { FlatSettingsDto } from './dto/settings.dto';

@Controller(ApiEndPoint.USERS)
@ApiTags(ApiEndPoint.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Accounts(
    AccountTypeEnum.ADMIN,
    AccountTypeEnum.INSTITUTION,
    AccountTypeEnum.SUG,
  )
  @Permission(PermisionActionTypeEnum.CREATE, PermisionSubjectTypeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create User')
  @ApiResponse({
    status: 201,
    description: 'User Created Successfully',
  })
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER,
      service: UserService,
    }),
  )
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create({ ...createUserDto, isActivated: true });
  }

  @Public()
  @Get('/validate-token')
  async validate(@Query('token') token: string) {
    return await this.userService.validateToken(token);
  }

  @Public()
  @ApiEndpoint('Verify User')
  @ApiResponse({
    status: 201,
    description: 'User Verifed',
  })
  @Get('/verify/:token')
  async verify(@Param('token') token: string) {
    return await this.userService.verifyToken(token);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Password Status',
  })
  @Get('/password-status')
  async checkPasswordExpiry(@CurrentUser() user: CurrentUserData) {
    return await this.userService.checkPasswordExpiry(user.id);
  }

  @Public()
  @ApiEndpoint('Account Password Reset')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER_PASSWORD,
      service: UserService,
      action: AuditAction.RESET,
    }),
  )
  @Post('/reset-password/:token')
  async resetPasseord(
    @Param('token') token: string,
    @Body() resetPasseordDto: ResetPasswordDto,
  ) {
    return await this.userService._resetPassword(token, resetPasseordDto);
  }

  @Accounts(AccountTypeEnum.ADMIN, AccountTypeEnum.INSTITUTION)
  @Permission(PermisionActionTypeEnum.CREATE, PermisionSubjectTypeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create User From Staff')
  @ApiResponse({
    status: 201,
    description: 'User Created Successfully',
  })
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER,
      service: UserService,
    }),
  )
  @Post('/staff')
  async createFromStaff(
    @Body() createUserFromStaffDto: CreateUserFromStaffDto,
  ) {
    return await this.userService.createFromStaff(createUserFromStaffDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Add User settings')
  @ApiResponse({
    status: 201,
    description: 'Settings Saved Successfully',
  })
  @Post('/settings')
  async settings(@Body() settings: FlatSettingsDto) {
    return await this.userService.settings(settings);
  }

  @ApiEndpoint('Add User settings')
  @ApiResponse({
    status: 201,
    description: 'Settings Saved Successfully',
  })
  @Get('/settings')
  async findSettings() {
    return await this.userService.findSettings();
  }

  @Accounts(AccountTypeEnum.ADMIN, AccountTypeEnum.INSTITUTION)
  @ApiFilterPagination('Get All Users')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
    @Req() req: Request,
  ) {
    return await this.userService.findAll(
      filterOptions,
      paginationOptions,
      req,
    );
  }

  @Accounts(AccountTypeEnum.ADMIN, AccountTypeEnum.INSTITUTION)
  @Permission(PermisionActionTypeEnum.READ, PermisionSubjectTypeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One User ')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Accounts(AccountTypeEnum.ADMIN, AccountTypeEnum.INSTITUTION)
  @Permission(PermisionActionTypeEnum.UPDATE, PermisionSubjectTypeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Update User')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER,
      service: UserService,
      changeKeys: ['firstName', 'lastName', 'email', 'isActivated'],
      factory: async (service, request) => {
        const data = await service.findOne(+request.params.id);
        return {
          data,
          title: data.nogicNumber,
        };
      },
    }),
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() userData: UpdateUserProfileDto) {
    return this.userService.update(+id, userData);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @Permission(PermisionActionTypeEnum.PASSWORD, PermisionSubjectTypeEnum.USER)
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER_PASSWORD,
      service: UserService,
      factory: async (service, request) => {
        const data = await service.findOne(+request.params.id);
        return {
          data,
          title: data.nogicNumber,
        };
      },
    }),
  )
  @Patch('/:id/change-password')
  async updatePassword(
    @Body()
    changePasswordDto: ChangePasswordDto,
    @Param('id') id: number,
  ) {
    return await this.userService.changePassword(+id, changePasswordDto);
  }

  // @Accounts(AccountTypeEnum.AGENCY)
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER_PASSWORD,
      service: UserService,
      action: AuditAction.RESET,
      factory: async (service, request) => {
        const data = await service.findOne(+request.params.id);
        return {
          data,
          title: data.nogicNumber,
        };
      },
    }),
  )
  @Patch('/:id/reset-password')
  async resetPassw(
    @Body()
    resetPasswordDto: ResetPasswordDto,
    @Param('id') id: number,
  ) {
    return await this.userService.resetPassword(+id, resetPasswordDto);
  }

  @Accounts(AccountTypeEnum.ADMIN, AccountTypeEnum.INSTITUTION)
  @Permission(PermisionActionTypeEnum.DELETE, PermisionSubjectTypeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete User')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER,
      service: UserService,
    }),
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(+id);
  }

  @Accounts(AccountTypeEnum.ADMIN, AccountTypeEnum.INSTITUTION)
  @ApiEndpoint('Delete account for user')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id/accounts/:accountId')
  detachAccount(
    @Param('id', ParseIntPipe) userId: number,
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    return this.userService.detachAccount(userId, accountId);
  }
}
