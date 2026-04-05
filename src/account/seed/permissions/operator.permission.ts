import { permissionActions, permissionSubjectName, subject } from './abilities';

export const operatorPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.operator,
    permissionGroupId: 33,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.operator,
    permissionGroupId: 33,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.operator,
    permissionGroupId: 33,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.operator,
    permissionGroupId: 33,
  },
];
