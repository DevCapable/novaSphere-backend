import { adminPermissionsDbSeed } from './admin-permissions.seed';
import { institutionPermissionsDbSeed } from './institution-permissions.seed';
import { departmentPermissionsDbSeed } from './department-permissions.seed';
import { sugPermissionsDbSeed } from './sug-permissions.seed';

export const rolePermissionsDbSeed = [
  ...adminPermissionsDbSeed,
  ...institutionPermissionsDbSeed,
  ...departmentPermissionsDbSeed,
  ...sugPermissionsDbSeed,
];
