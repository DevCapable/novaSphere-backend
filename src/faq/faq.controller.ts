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
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@app/iam/decorators';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';

@Controller('faqs')
@ApiTags('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Faq')
  @ApiResponse({
    status: 201,
    description: 'Created Successfully',
  })
  @Post()
  create(@Body() createFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Public()
  @ApiFilterPagination('All Faqs')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  findAll(@FiltersQuery() filterOptions, @PaginationQuery() paginationOptions) {
    return this.faqService.findAll(filterOptions, paginationOptions);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Faq')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Faq',
    description: 'Update Any Faq Data',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto) {
    return this.faqService.update(+id, updateFaqDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete Faq')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.delete(+id);
  }
}
