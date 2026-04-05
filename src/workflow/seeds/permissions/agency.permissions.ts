import { permissionActions, permissionSubjectName, subject } from './abilities';

export const agencyPermissionsDbSeed = [
  {
    action: permissionActions.REASSIGN,
    title: permissionSubjectName.REASSIGN,
    subject: subject.name,
    permissionGroupId: 68,
    origin: null,
  },
];
