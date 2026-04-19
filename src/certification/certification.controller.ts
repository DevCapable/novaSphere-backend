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
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AccountTypeEnum } from '@app/account/enums';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';

@Controller('certifications')
@Accounts(
  AccountTypeEnum.INDIVIDUAL,
  AccountTypeEnum.ADMIN,
  AccountTypeEnum.DEPARTMENT,
  AccountTypeEnum.INSTITUTION,
  AccountTypeEnum.SUG,
  AccountTypeEnum.COMMUNITY_VENDOR,
  AccountTypeEnum.LECTURER,
)
@ApiTags('certifications')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Certification')
  @ApiResponse({
    status: 201,
    description: 'Certification Created Successfully',
  })
  @Post()
  create(@Body() createCertificationDto: CreateCertificationDto) {
    return this.certificationService.create(createCertificationDto);
  }

  @ApiFilterPagination('Get all Certification Record for company')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.certificationService.findAll(
      filterOptions,
      paginationOptions,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Certification Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificationService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Certification Record',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateCertificationDto: any) {
    return this.certificationService.update(+id, UpdateCertificationDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete Certification Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificationService.delete(+id);
  }
}
