import { permissionActions, permissionSubjectName, subject } from './abilities';

export const companyMvcReportPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_DEPARTMENT,
    subject: subject.name,
    permissionGroupId: 11,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_DEPARTMENT,
    subject: subject.name,
    permissionGroupId: 11,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.EDIT_DEPARTMENT,
    subject: subject.name,
    permissionGroupId: 11,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE_DEPARTMENT,
    subject: subject.name,
    permissionGroupId: 11,
  },
];
