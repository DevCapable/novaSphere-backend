import { permissionActions, permissionSubjectName, subject } from './abilities';

export const sugPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.sug,
    permissionGroupId: 11,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.sug,
    permissionGroupId: 11,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.sug,
    permissionGroupId: 11,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.sug,
    permissionGroupId: 11,
  },
];
