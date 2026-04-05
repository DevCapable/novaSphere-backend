import { permissionActions, permissionSubjectName, subject } from './abilities';

export const companyPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.company,
    permissionGroupId: 32,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.company,
    permissionGroupId: 32,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.company,
    permissionGroupId: 32,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.company,
    permissionGroupId: 32,
  },
];
