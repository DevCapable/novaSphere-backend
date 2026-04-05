import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AccountTypeEnum } from '@app/account/enums';
import { CurrentUser, Public } from '@app/iam/decorators';
import { PaginationQuery } from '@app/core/providers/pagination/pagination-query.decorator';
import { ApiTags } from '@nestjs/swagger';
import {
  CustomNotFoundException,
  CustomValidationException,
} from '@app/core/error';
import { BatchReassignDto } from './dto/batch-reassign.dto';
const BASE_PATH = 'workflows';
@Controller(BASE_PATH)
@ApiTags(BASE_PATH)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Accounts(AccountTypeEnum.AGENCY)
  @Get('groups')
  async groups(
    @Query('search') search: string,
    @Query('module') module: string,
    @PaginationQuery() paginationOptions,
  ) {
    const { skip, limit, page } = paginationOptions || {};

    const _search = module || search || '';

    const agencySearch = `NCDMB ${_search}`.trim();

    const groups = await this.workflowService.getGroups(
      agencySearch,
      skip,
      limit,
    );

    if (!groups || !Array.isArray(groups))
      return { meta: { totalCount: 0, page, limit }, data: [] };

    const pagedGroups = groups.map((group) => ({
      id: group.grp_uid,
      name: group.grp_title,
      users: group.grp_users,
      status: group.grp_status,
      tasks: group.grp_tasks,
    }));

    return {
      meta: {
        totalCount: (groups as any).total || groups.length,
        page: page,
        limit: limit,
      },
      data: pagedGroups,
    };
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Get('users/:id')
  async getUser(@Param('id') userId: string) {
    return this.workflowService.getUserById(+userId);
  }

  @Public()
  @Get('groups/:id/users')
  async groupUsers(@Param('id') id: string, @Query('search') search: string) {
    return this.workflowService.getGroupUsers(id, search);
  }

  @Accounts(
    AccountTypeEnum.AGENCY,
    AccountTypeEnum.OPERATOR,
    AccountTypeEnum.COMPANY,
  )
  @Get('/tasks')
  async tasks(
    @CurrentUser() currentUser,
    @Query('type') type: string,
    @Query('module') module: string,
    @Query('userId')
    userId: string,
    @PaginationQuery() paginationOptions,
  ) {
    const taskType = type || 'PENDING';

    const { skip, limit, page } = paginationOptions || {};

    return this.workflowService.getCases({
      currentUser,
      userId,
      type: taskType,
      start: skip,
      limit,
      page,
      module,
    });
  }

  @Accounts(
    AccountTypeEnum.AGENCY,
    AccountTypeEnum.OPERATOR,
    AccountTypeEnum.COMPANY,
    AccountTypeEnum.INDIVIDUAL,
    AccountTypeEnum.INSTITUTION,
  )
  @Get('/case/:caseId')
  async case(
    @CurrentUser() user,
    @Param('caseId') caseId: string,
    @Query('withAdhocUsers', ParseIntPipe) withAdhocUsers = '0',
  ) {
    if (caseId === 'null') return;

    return this.workflowService.getCase(caseId, user, !!withAdhocUsers);
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Post('/reassign/:caseId')
  async reassign(
    @Param('caseId') caseId: string,
    @Body('assigneeWfUserId') assigneeWfUserId: string,
  ) {
    try {
      if (!assigneeWfUserId) {
        throw new CustomValidationException({
          assigneeWfUserId: 'Assignee is required',
        });
      }
      return this.workflowService.reassignCase(caseId, assigneeWfUserId);
    } catch (e) {
      if (e instanceof CustomValidationException) throw e;
      throw new CustomNotFoundException(
        'An error occurred while reassigning task',
      );
    }
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Get('/sync/:userId')
  async sync(@Param('userId') userId: string) {
    try {
      await this.workflowService.getUser(userId);
      return {
        status: true,
      };
    } catch (e) {
      return {
        status: false,
      };
    }
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Post('/sync/:userId')
  async syncUpdate(@Param('userId') userId: string) {
    try {
      return this.workflowService.syncUser(userId);
    } catch (e) {
      throw new CustomNotFoundException('An error occurred while syncing user');
    }
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Post('/case/:caseId/claim')
  async claimCase(
    @CurrentUser() user,
    @Param('caseId') caseId: string,
    @Body() body: { delIndex: number },
  ) {
    return this.workflowService.claim(caseId, user, body.delIndex);
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Get('/unassigned-tasks/:caseId')
  async unAssignedCases(@CurrentUser() user, @Param('caseId') caseId: string) {
    return this.workflowService.getUnassignCases(user, caseId);
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Post('/batch-reassign')
  async batchReassignCases(@Body() payload: BatchReassignDto) {
    return this.workflowService.batchReassignCases(payload);
  }
}
