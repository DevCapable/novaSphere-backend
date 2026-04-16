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
import { CreateTrainingDto } from './dto/create-training.dto';
import { AccountTypeEnum } from '@app/account/enums';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { TrainingService } from '@app/training/training.service';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';

@Controller('trainings')
@Accounts(
  AccountTypeEnum.INDIVIDUAL,
  AccountTypeEnum.ADMIN,
  AccountTypeEnum.DEPARTMENT,
  AccountTypeEnum.INSTITUTION,
  AccountTypeEnum.LECTURER,
)
@ApiTags('trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Training')
  @ApiResponse({
    status: 201,
    description: 'Training Created Successfully',
  })
  @Post()
  create(@Body() createTrainingsDto: CreateTrainingDto) {
    return this.trainingService.create(createTrainingsDto);
  }

  @ApiFilterPagination('Get all trainings for an Individual')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.trainingService.findAll(filterOptions, paginationOptions);
  }

  @ApiEndpoint('Get One Training')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update Training',
    description: 'Update Any Training Data',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateTrainingDto: any) {
    return this.trainingService.update(+id, UpdateTrainingDto);
  }

  @ApiEndpoint('Delete Training')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingService.delete(+id);
  }
}
