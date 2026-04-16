import { permissionActions, permissionSubjectName, subject } from './abilities';

export const lecturerPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.lecturer,
    permissionGroupId: 13,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.lecturer,
    permissionGroupId: 13,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.lecturer,
    permissionGroupId: 13,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.lecturer,
    permissionGroupId: 13,
  },
];
