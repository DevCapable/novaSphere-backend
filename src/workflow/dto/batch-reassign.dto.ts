import { IsArray, IsNumber, IsString } from 'class-validator';

import { BatchReassignPayload } from '@app/workflow/interfaces';

export class BatchReassignDto implements BatchReassignPayload {
  @IsArray()
  caseIds: string[];

  @IsNumber()
  assigneeId: number;

  @IsNumber()
  ownerId: number;

  @IsString()
  groupId: string;
}
