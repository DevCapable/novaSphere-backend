import { permissionActions, permissionSubjectName, subject } from './abilities';

export const auditPermissionsDbSeed = [
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_AUDIT_LOG,
    subject: subject.name,
    permissionGroupId: 44,
  },
];
