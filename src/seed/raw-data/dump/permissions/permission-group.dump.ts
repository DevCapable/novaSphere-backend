import { AccountTypeEnum } from '@app/account/enums';
import { PermissionGroupName } from './abilities/group-name';

export const permissionGroups = [
  // --- USER MANAGEMENT ---
  {
    id: 1,
    name: PermissionGroupName.USER,
    type: AccountTypeEnum.INSTITUTION,
  },
  {
    id: 2,
    name: PermissionGroupName.USER,
    type: AccountTypeEnum.DEPARTMENT,
  },
  {
    id: 3,
    name: PermissionGroupName.USER,
    type: AccountTypeEnum.ADMIN,
  },

  // --- ROLE & ACCESS ---
  {
    id: 4,
    name: PermissionGroupName.ROLE,
    type: AccountTypeEnum.SUG,
  },
  {
    id: 5,
    name: PermissionGroupName.ROLE,
    type: AccountTypeEnum.INSTITUTION,
  },
  {
    id: 6,
    name: PermissionGroupName.ROLE,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 7,
    name: PermissionGroupName.ROLE,
    type: AccountTypeEnum.DEPARTMENT,
  },
  {
    id: 8,
    name: PermissionGroupName.SPECIAL_PERMISSION,
    type: AccountTypeEnum.ADMIN,
  },

  // --- ACCOUNT TYPES (ADMIN VIEW) ---
  {
    id: 9,
    name: PermissionGroupName.INDIVIDUAL,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 10,
    name: PermissionGroupName.INSTITUTION,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 11,
    name: PermissionGroupName.SUG,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 12,
    name: PermissionGroupName.ADMIN,
    type: AccountTypeEnum.ADMIN,
  },

  {
    id: 13,
    name: PermissionGroupName.DEPARTMENT,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 14,
    name: PermissionGroupName.DEPARTMENT,
    type: AccountTypeEnum.INSTITUTION,
  },

  // --- SYSTEM CONFIGURATION ---
  {
    id: 15,
    name: PermissionGroupName.BASE_RECORD,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 16,
    name: PermissionGroupName.SETTINGS,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 17,
    name: PermissionGroupName.WORKFLOW,
    type: AccountTypeEnum.ADMIN,
  },

  // --- CONTENT & SUPPORT ---
  {
    id: 18,
    name: PermissionGroupName.DOCUMENT,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 19,
    name: PermissionGroupName.GUIDELINES,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 20,
    name: PermissionGroupName.FAQ,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 21,
    name: PermissionGroupName.NEWS,
    type: AccountTypeEnum.ADMIN,
  },

  // --- FINANCE & AUDIT ---
  {
    id: 22,
    name: PermissionGroupName.PAYMENT,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 23,
    name: PermissionGroupName.AUDIT_LOG,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 24,
    name: PermissionGroupName.AUDITOR,
    type: AccountTypeEnum.ADMIN,
  },

  // --- SECURITY ---
  {
    id: 25,
    name: PermissionGroupName.WHISTLE_BLOWER,
    type: AccountTypeEnum.ADMIN,
  },

  // --- LEGACY IDS FOR COMPATIBILITY ---
  {
    id: 39,
    name: PermissionGroupName.DOCUMENT,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 41,
    name: PermissionGroupName.GUIDELINES,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 42,
    name: PermissionGroupName.FAQ,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 44,
    name: PermissionGroupName.AUDIT_LOG,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 68,
    name: PermissionGroupName.WORKFLOW,
    type: AccountTypeEnum.ADMIN,
  },
];
