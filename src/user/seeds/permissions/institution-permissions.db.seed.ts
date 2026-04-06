import { permissionActions, permissionSubjectName, subject } from './abilities';

export const institutionPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 1,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 1,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 1,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 1,
  },
];
