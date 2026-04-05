import { AccountTypeEnum } from '@app/account/enums';
import { PermissionGroupName } from './abilities/group-name';

export const permissionGroups = [
  // // MARINE_VESSEL
  // {
  //   id: 1,
  //   name: PermissionGroupName.MARINE_VESSEL,
  //   type: AccountTypeEnum.COMPANY,
  //   slug: Slug.MARINE_VESSEL,
  // },
  {
    id: 2,
    name: PermissionGroupName.MARINE_VESSEL,
    type: AccountTypeEnum.ADMIN,
  },
  // USER
  // {
  //   id: 3,
  //   name: PermissionGroupName.USER_MANAGEMENT,
  //   type: AccountTypeEnum.COMPANY,
  // },
  {
    id: 4,
    name: PermissionGroupName.USER,
    type: AccountTypeEnum.OPERATOR,
  },
  {
    id: 5,
    name: PermissionGroupName.USER,
    type: AccountTypeEnum.ADMIN,
  },

  // NCTRC
  // {
  //   id: 6,
  //   name: PermissionGroupName.NCTRC,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 7,
  //   name: PermissionGroupName.NCTRC,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 8,
    name: PermissionGroupName.NCTRC,
    type: AccountTypeEnum.ADMIN,
  },
  // // ADVERT
  // {
  //   id: 9,
  //   name: PermissionGroupName.ADVERT,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 10,
  //   name: PermissionGroupName.ADVERT,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 11,
    name: PermissionGroupName.ADVERT,
    type: AccountTypeEnum.ADMIN,
  },

  // // NCRC
  {
    id: 12,
    name: PermissionGroupName.NCRC,
    type: AccountTypeEnum.COMPANY,
  },
  {
    id: 13,
    name: PermissionGroupName.NCRC,
    type: AccountTypeEnum.OPERATOR,
  },
  {
    id: 14,
    name: PermissionGroupName.NCRC,
    type: AccountTypeEnum.ADMIN,
  },

  // EXCHANGE PROG
  // {
  //   id: 15,
  //   name: PermissionGroupName.EXCHANGE_PROGRAM,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 16,
  //   name: PermissionGroupName.EXCHANGE_PROGRAM,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 17,
    name: PermissionGroupName.EXCHANGE_PROGRAM,
    type: AccountTypeEnum.ADMIN,
  },

  // TWP
  // {
  //   id: 18,
  //   name: PermissionGroupName.TWP,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 19,
  //   name: PermissionGroupName.TWP,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 20,
    name: PermissionGroupName.TWP,
    type: AccountTypeEnum.ADMIN,
  },

  // EQ
  {
    id: 21,
    name: PermissionGroupName.EQ,
    type: AccountTypeEnum.COMPANY,
  },
  {
    id: 22,
    name: PermissionGroupName.EQ,
    type: AccountTypeEnum.OPERATOR,
  },
  {
    id: 23,
    name: PermissionGroupName.EQ,
    type: AccountTypeEnum.ADMIN,
  },

  // NCTRC
  {
    id: 24,
    name: PermissionGroupName.NCTRC_TRANINING_COURSE,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 25,
    name: PermissionGroupName.NCTRC_MATRIX_CRITERIA,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 26,
    name: PermissionGroupName.NCTRC_AREA_OF_SPECIALIZATION,
    type: AccountTypeEnum.ADMIN,
  },
  // SPECIAL PERMISSION
  {
    id: 27,
    name: PermissionGroupName.SPECIAL_PERMISSION,
    type: AccountTypeEnum.ADMIN,
  },
  // ROLE
  // {
  //   id: 28,
  //   name: PermissionGroupName.ROLE_MANAGEMENT,
  //   type: AccountTypeEnum.COMPANY,
  // },
  {
    id: 29,
    name: PermissionGroupName.ROLE,
    type: AccountTypeEnum.OPERATOR,
  },
  {
    id: 30,
    name: PermissionGroupName.ROLE,
    type: AccountTypeEnum.ADMIN,
  },

  //ACCOUNTS
  {
    id: 31,
    name: PermissionGroupName.INDIVIDUAL,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 32,
    name: PermissionGroupName.COMPANY,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 33,
    name: PermissionGroupName.OPERATOR,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 34,
    name: PermissionGroupName.NCDMB_STAFF,
    type: AccountTypeEnum.ADMIN,
  },

  // NCEC
  // {
  //   id: 35,
  //   name: PermissionGroupName.NCEC,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 36,
  //   name: PermissionGroupName.NCEC,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 37,
    name: PermissionGroupName.NCEC,
    type: AccountTypeEnum.ADMIN,
  },

  // BASE RECORD
  {
    id: 38,
    name: PermissionGroupName.BASE_RECORD,
    type: AccountTypeEnum.ADMIN,
  },

  // DOCUMENT
  {
    id: 39,
    name: PermissionGroupName.DOCUMENT,
    type: AccountTypeEnum.ADMIN,
  },

  // WHISTLE BLOWER
  {
    id: 40,
    name: PermissionGroupName.WHISTLE_BLOWER,
    type: AccountTypeEnum.ADMIN,
  },

  // DOCUMENT
  {
    id: 41,
    name: PermissionGroupName.GUIDELINES,
    type: AccountTypeEnum.ADMIN,
  },

  // FAQS
  {
    id: 42,
    name: PermissionGroupName.FAQ,
    type: AccountTypeEnum.ADMIN,
  },

  // COR
  {
    id: 43,
    name: PermissionGroupName.COR,
    type: AccountTypeEnum.ADMIN,
  },

  // AUDIT LOGS
  {
    id: 44,
    name: PermissionGroupName.AUDIT_LOG,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 49,
    name: PermissionGroupName.RESEARCH,
    type: AccountTypeEnum.ADMIN,
  },

  {
    id: 50,
    name: PermissionGroupName.INSTITUTION,
    type: AccountTypeEnum.ADMIN,
  },

  // NCDF
  {
    id: 51,
    name: PermissionGroupName.PAYMENT,
    type: AccountTypeEnum.ADMIN,
  },

  // E MARKET
  {
    id: 54,
    name: PermissionGroupName.SERVICE_CODE,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 55,
    name: PermissionGroupName.TENDER,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 56,
    name: PermissionGroupName.SUBSCRIPTION,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 57,
    name: PermissionGroupName.SETTINGS,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 58,
    name: PermissionGroupName.FAQ,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 59,
    name: PermissionGroupName.NEWS,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 52,
    name: PermissionGroupName.RESEARCH,
    type: AccountTypeEnum.INDIVIDUAL,
  },
  {
    id: 53,
    name: PermissionGroupName.RESEARCH,
    type: AccountTypeEnum.INSTITUTION,
  },
  {
    id: 62,
    name: PermissionGroupName.JOB_FORECAST,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 63,
    name: PermissionGroupName.SERVICE_UTILIZATION_REPORT,
    type: AccountTypeEnum.ADMIN,
  },

  {
    id: 64,
    name: PermissionGroupName.MARINE_VESSEL_REPORT_APPLICATION,
    type: AccountTypeEnum.ADMIN,
  },

  {
    id: 65,
    name: PermissionGroupName.MARINE_VESSEL_REPORT_APPLICATION,
    type: AccountTypeEnum.COMPANY,
  },
  {
    id: 66,
    name: PermissionGroupName.HCD_TRAINING_PROGRAM,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 67,
    name: PermissionGroupName.RESEARCH,
    type: AccountTypeEnum.COMPANY,
  },
  {
    id: 68,
    name: PermissionGroupName.WORKFLOW,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 69,
    name: PermissionGroupName.AUDITOR,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 70,
    name: PermissionGroupName.TENDER,
    type: AccountTypeEnum.OPERATOR,
  },
  {
    id: 71,
    name: PermissionGroupName.DEPARTMENT,
    type: AccountTypeEnum.OPERATOR,
  },
];
