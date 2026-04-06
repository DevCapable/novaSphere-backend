import { adminPermissionDbSeed } from './admin.permission';
import { sugPermissionDbSeed } from './sug.permission';
import { individualPermissionDbSeed } from './individual.permission';
import { institutionPermissionDbSeed } from '@app/account/seed/permissions/institutiton.permission';

export const accountPermissionsDbSeed = [
  ...individualPermissionDbSeed,
  ...sugPermissionDbSeed,
  ...adminPermissionDbSeed,
  ...institutionPermissionDbSeed,
];
