import { permissionActions, permissionSubjectName, subject } from './abilities';

export const departmentPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.department,
    permissionGroupId: 14,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.department,
    permissionGroupId: 14,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.department,
    permissionGroupId: 14,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.department,
    permissionGroupId: 14,
  },
];
