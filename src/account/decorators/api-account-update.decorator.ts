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
            $ref: getSchemaPath(UpdateOperatorDto),
          },
        ],
      },
    }),
  );
