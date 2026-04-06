import { permissionActions, permissionSubjectName, subject } from './abilities';

export const sugPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_ROLE,
    subject: subject.name,
    permissionGroupId: 4,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_ROLE,
    subject: subject.name,
    permissionGroupId: 4,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_ROLE,
    subject: subject.name,
    permissionGroupId: 4,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE_ROLE,
    subject: subject.name,
    permissionGroupId: 4,
  },
];
