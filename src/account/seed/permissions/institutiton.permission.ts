import { permissionActions, permissionSubjectName, subject } from './abilities';

export const institutionPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.institution,
    permissionGroupId: 10,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.institution,
    permissionGroupId: 10,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.institution,
    permissionGroupId: 10,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.institution,
    permissionGroupId: 10,
  },
];
