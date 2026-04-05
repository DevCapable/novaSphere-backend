import { permissionActions, permissionSubjectName, subject } from './abilities';

export const faqPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.faq,
    permissionGroupId: 42,
    origin: null,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.faq,
    permissionGroupId: 42,
    origin: null,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.faq,
    permissionGroupId: 42,
    origin: null,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE,
    subject: subject.faq,
    permissionGroupId: 42,
    origin: null,
  },
];
