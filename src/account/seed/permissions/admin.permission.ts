import { permissionActions, permissionSubjectName, subject } from './abilities';

export const adminPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.admin,
    permissionGroupId: 9,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.admin,
    permissionGroupId: 9,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.admin,
    permissionGroupId: 9,
  },
  {
    action: permissionActions.WORKFLOW,
    title: permissionSubjectName.WORKFLOW_GROUP,
    subject: subject.admin,
    permissionGroupId: 9,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.admin,
    permissionGroupId: 9,
  },
];
