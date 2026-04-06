import { permissionActions, permissionSubjectName, subject } from './abilities';

export const agencyMvcReportPermissionsDbSeed = [
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_DEPARTMENT,
    subject: subject.name,
    permissionGroupId: 10,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.EDIT_DEPARTMENT,
    subject: subject.name,
    permissionGroupId: 10,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT_DEPARTMENT,
    subject: subject.name,
    permissionGroupId: 10,
  },
  {
    action: permissionActions.DOWNLOAD,
    title: permissionSubjectName.DOWNLOAD_DEPARTMENT,
    subject: subject.name,
    permissionGroupId: 10,
  },
  {
    action: permissionActions.CREATE_DOCUMENTS,
    title: permissionSubjectName.CREATE_DOCUMENTS,
    subject: subject.name,
    permissionGroupId: 10,
  },
];
