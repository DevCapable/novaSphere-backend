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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateJobExperienceDto } from './dto/create-job-experience.dto';
import { AccountTypeEnum } from '@app/account/enums';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { JobExperienceService } from '@app/job-experience/job-experience.service';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';

@Controller('job-experience')
@Accounts(
  AccountTypeEnum.INDIVIDUAL,
  AccountTypeEnum.ADMIN,
  AccountTypeEnum.DEPARTMENT,
  AccountTypeEnum.INSTITUTION,
  AccountTypeEnum.LECTURER,
)
@ApiTags('job-experiences')
export class JobExperienceController {
  constructor(private readonly jobExperiencesService: JobExperienceService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Job Experience')
  @ApiResponse({
    status: 201,
    description: 'Job Experience Created Successfully',
  })
  @Post()
  create(@Body() createJobExperienceDto: CreateJobExperienceDto) {
    return this.jobExperiencesService.create(createJobExperienceDto);
  }

  @ApiFilterPagination('Get all Job Experiences for an Individual')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.jobExperiencesService.findAll(
      filterOptions,
      paginationOptions,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Job Experience Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobExperiencesService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Job Experience Record',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobExperienceDto: any) {
    return this.jobExperiencesService.update(+id, updateJobExperienceDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete Job Experience Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobExperiencesService.delete(+id);
  }
}
