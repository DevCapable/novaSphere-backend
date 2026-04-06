import { permissionActions, permissionSubjectName, subject } from './abilities';

export const departmentPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_ROLE,
    subject: subject.name,
    permissionGroupId: 7,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_ROLE,
    subject: subject.name,
    permissionGroupId: 7,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_ROLE,
    subject: subject.name,
    permissionGroupId: 7,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE_ROLE,
    subject: subject.name,
    permissionGroupId: 7,
  },
];
