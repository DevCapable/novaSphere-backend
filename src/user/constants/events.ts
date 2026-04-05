import { UserSettingKeyEnum } from '../enum';

export const SYNC_WORKFLOW_EVENT = 'user.sync_workflow';

export const USER_SETTING_TYPE_MAP: Record<
  UserSettingKeyEnum,
  'string' | 'number' | 'boolean'
> = {
  [UserSettingKeyEnum.LOGIN_OTP_ENABLED]: 'boolean',
};
