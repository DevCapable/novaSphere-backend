import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGuidelineDto } from './dto/create-guideline.dto';
import { GuidelineService } from '@app/guideline/guideline.service';
import { AccountTypeEnum } from '@app/account/enums';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { CreateDocumentFileInterceptor } from '@app/document/interceptors/create-document-file.interceptor';
import { EntityType } from '@app/audit-log/enum';
import { DocumentFilesInterceptor } from '@app/document/interceptors/documentFiles.interceptor';
import { ApiEndPoint } from '@app/core/interface/api-endpoint.interface';
import { GuidelineAccountType } from '@app/guideline/interfaces';
import { CurrentUser } from '@app/iam/decorators';

@Controller(ApiEndPoint.GUIDELINE)
@ApiTags(ApiEndPoint.GUIDELINE)
@UseInterceptors(
  AuditLogInterceptor({
    entityType: EntityType.GUIDELINE,
    service: GuidelineService,
  }),
)
export class GuidelineController {
  constructor(private readonly guidelineService: GuidelineService) {}

  @Accounts(AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Guideline')
  @ApiResponse({
    status: 201,
    description: 'Guideline Created Successfully',
  })
  @UseInterceptors(CreateDocumentFileInterceptor(GuidelineService))
  @Post()
  create(@Body() createGuidelineDto: CreateGuidelineDto) {
    return this.guidelineService.create(createGuidelineDto);
  }

  @ApiFilterPagination('Get all Guideline for a Company')
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(DocumentFilesInterceptor(GuidelineService))
  @ApiQuery({
    name: 'accountType',
    enum: GuidelineAccountType,
    required: false,
  })
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
    @CurrentUser() user,
  ) {
    filterOptions.accountType = user.account.type;
    return await this.guidelineService.findAll(
      filterOptions,
      paginationOptions,
    );
  }

  @Accounts(AccountTypeEnum.COMPANY, AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Guideline Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @UseInterceptors(DocumentFilesInterceptor(GuidelineService))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guidelineService.findOne(+id);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Update Guideline Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @UseInterceptors(CreateDocumentFileInterceptor(GuidelineService))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuidelineDto: any) {
    return this.guidelineService.update(+id, updateGuidelineDto);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete Guideline Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guidelineService.delete(+id);
  }
}
