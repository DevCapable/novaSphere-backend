import { ncdmbPermissionDbSeed } from './agency.permission';
import { companyPermissionDbSeed } from './company.permission';
import { individualPermissionDbSeed } from './individual.permission';
import { operatorPermissionDbSeed } from './operator.permission';
import { institutionPermissionDbSeed } from '@app/account/seed/permissions/institutiton.permission';

export const accountPermissionsDbSeed = [
  ...individualPermissionDbSeed,
  ...companyPermissionDbSeed,
  ...operatorPermissionDbSeed,
  ...ncdmbPermissionDbSeed,
  ...institutionPermissionDbSeed,
];
