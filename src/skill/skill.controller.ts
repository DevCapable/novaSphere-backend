import { AccountTypeEnum } from '@app/account/enums';
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
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import { CreateSkillDto } from '@app/skill/dto/create-skill.dto';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { SkillService } from '@app/skill/skill.service';
@Controller('skills')
@Accounts(
  AccountTypeEnum.INDIVIDUAL,
  AccountTypeEnum.ADMIN,
  AccountTypeEnum.DEPARTMENT,
  AccountTypeEnum.INSTITUTION,
  AccountTypeEnum.LECTURER,
)
@ApiTags('skills')
export class SkillController {
  constructor(private readonly skillsService: SkillService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Skill')
  @ApiResponse({
    status: 201,
    description: 'Skill Created Successfully',
  })
  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @ApiFilterPagination('Get all skills for an Individual')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions: any,
    @PaginationQuery() paginationOptions: any,
  ) {
    return await this.skillsService.findAll(filterOptions, paginationOptions);
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Skill Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Skill Record',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: any) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete Skill Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.delete(+id);
  }
}
