import { permissionActions, permissionSubjectName, subject } from './abilities';

export const guidelinePermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.guideline,
    permissionGroupId: 41,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.guideline,
    permissionGroupId: 41,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.guideline,
    permissionGroupId: 41,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE,
    subject: subject.guideline,
    permissionGroupId: 41,
  },
];
