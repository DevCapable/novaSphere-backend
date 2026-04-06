import { permissionActions, permissionSubjectName, subject } from './abilities';

export const institutionPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_ROLE,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_ROLE,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_ROLE,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE_ROLE,
    subject: subject.name,
    permissionGroupId: 5,
  },
];
