import { IUpdateAuditorDto } from '@app/account/interface';
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAuditorDto } from './create-auditor-dto';

export class UpdateAuditorDto
  extends PartialType(OmitType(CreateAuditorDto, ['email']))
  implements IUpdateAuditorDto
{
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
