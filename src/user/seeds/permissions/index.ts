import { adminPermissionsDbSeed } from './admin-permissions.db.seed';
import { institutionPermissionsDbSeed } from './institution-permissions.db.seed';
import { departmentPermissionsDbSeed } from './department-permissions.db.seed';

export const userPermissionsDbSeed = [
  ...adminPermissionsDbSeed,
  ...institutionPermissionsDbSeed,
  ...departmentPermissionsDbSeed,
];
