import { permissionActions, permissionSubjectName, subject } from './abilities';

export const agencyPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 5,
    origin: null,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 5,
    origin: null,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 5,
    origin: null,
  },
  {
    action: permissionActions.ACTIVATION,
    title: permissionSubjectName.ACTIVATION,
    subject: subject.name,
    permissionGroupId: 5,
    origin: null,
  },
  {
    action: permissionActions.PASSWORD,
    title: permissionSubjectName.CHANGE_PASSWORD,
    subject: subject.name,
    permissionGroupId: 5,
    origin: null,
  },
  {
    action: permissionActions.WORKFLOW,
    title: permissionSubjectName.WORKFLOW_TASK,
    subject: subject.name,
    permissionGroupId: 5,
    origin: null,
  },
  {
    action: permissionActions.ARCHIVE,
    title: permissionSubjectName.ARCHIVE,
    subject: subject.name,
    permissionGroupId: 5,
    origin: null,
  },
];
