import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  UpdateAdminDto,
  UpdateInstitutionDto,
  UpdateIndividualDto,
  UpdateOperatorDto,
  UpdateDepartmentDto, // Import UpdateDepartmentDto
} from '../dto';

export const ApiAccountUpdate = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update Authenticated Account Profile',
    }),
    ApiExtraModels(
      UpdateIndividualDto,
      UpdateInstitutionDto,
      UpdateAdminDto,
      UpdateDepartmentDto,
      UpdateOperatorDto,
    ),
    ApiBody({
      schema: {
        oneOf: [
          {
            $ref: getSchemaPath(UpdateIndividualDto),
          },
          {
            $ref: getSchemaPath(UpdateInstitutionDto),
          },
          {
            $ref: getSchemaPath(UpdateAdminDto),
          },
          {
            $ref: getSchemaPath(UpdateDepartmentDto),
          },
          {
            $ref: getSchemaPath(UpdateOperatorDto),
          },
        ],
      },
    }),
  );
