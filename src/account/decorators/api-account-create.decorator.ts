import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CreateAdminDto,
  CreateInstitutionDto,
  CreateIndividualDto,
  CreateOperatorDto,
} from '../dto';
import { AccountTypeEnum } from '../enums';

export const ApiAccountCreate = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create an Account',
      description: `Creates an account based on an account type( ${Object.values(
        AccountTypeEnum,
      ).join(', ')})`,
    }),
    ApiExtraModels(
      CreateIndividualDto,
      CreateInstitutionDto,
      CreateAdminDto,
      CreateOperatorDto,
    ),
    ApiBody({
      schema: {
        oneOf: [
          {
            $ref: getSchemaPath(CreateIndividualDto),
          },
          {
            $ref: getSchemaPath(CreateInstitutionDto),
          },
          {
            $ref: getSchemaPath(CreateAdminDto),
          },
          {
            $ref: getSchemaPath(CreateOperatorDto),
          },
        ],
      },
    }),
  );
