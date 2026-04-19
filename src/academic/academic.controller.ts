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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAcademicDto } from './dto/create-academic.dto';
import { AccountTypeEnum } from '@app/account/enums';
import { AcademicService } from '@app/academic/academic.service';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import { UpdateAcademicDto } from '@app/academic/dto/update-academic.dto';

@Controller('academics')
@Accounts(
  AccountTypeEnum.INDIVIDUAL,
  AccountTypeEnum.ADMIN,
  AccountTypeEnum.DEPARTMENT,
  AccountTypeEnum.INSTITUTION,
  AccountTypeEnum.SUG,
  AccountTypeEnum.COMMUNITY_VENDOR,
  AccountTypeEnum.LECTURER,
)
@ApiTags('academics')
export class AcademicController {
  constructor(private readonly academicsService: AcademicService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Academic')
  @ApiResponse({
    status: 201,
    description: 'Academic Created Successfully',
  })
  @Post()
  create(@Body() createAcademicDto: CreateAcademicDto) {
    return this.academicsService.create(createAcademicDto);
  }

  @ApiFilterPagination('Get all Academics Record for individual')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.academicsService.findAll(
      filterOptions,
      paginationOptions,
    );
  }

  @ApiEndpoint('Get One Academic Record')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicsService.findOne(+id);
  }

  @ApiEndpoint('Update Academic Record')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAcademicDto) {
    return this.academicsService.update(+id, updateDto);
  }

  @ApiEndpoint('Delete Academic Record')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicsService.delete(+id);
  }
}
