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
import { BulkUploadService } from './bulk-upload.service';
import { CreateBulkUploadDto } from './dto/create-bulk-upload.dto';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AccountTypeEnum } from '@app/account/enums';

@Controller('bulk-uploads')
@ApiTags('bulk-uploads')
export class BulkUploadController {
  constructor(private readonly bulkUploadService: BulkUploadService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Bulk Upload')
  @ApiResponse({
    status: 201,
    description: 'Bulk upload Created Successfully',
  })
  @Post()
  async create(@Body() createBulkUploadDto: CreateBulkUploadDto) {
    return this.bulkUploadService.create(createBulkUploadDto);
  }

  @Accounts(AccountTypeEnum.COMPANY, AccountTypeEnum.ADMIN)
  @ApiFilterPagination('Get all upload files')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.bulkUploadService.findAll(
      filterOptions,
      paginationOptions,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bulkUploadService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update bulk upload',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBulkUploadDto: any,
  ) {
    return this.bulkUploadService.update(id, updateBulkUploadDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete record uploaded')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.bulkUploadService.delete(id);
  }
}
