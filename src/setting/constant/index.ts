import { SettingKeyEnum } from '../enum';

export const settingConstant = {
  userPasswordExpiryFrequency: 6,
  userPasswordExpiryDuration: 'Month',
  userSetOtpOnLogin: false,
};

export const SETTING_TYPE_MAP: Record<
  SettingKeyEnum,
  'string' | 'number' | 'boolean'
> = {
  [SettingKeyEnum.SUBSCRIPTION_PRICE]: 'number',
  [SettingKeyEnum.SUBSCRIPTION_DURATION]: 'number',
  [SettingKeyEnum.SERVICE_CODE_AMOUNT]: 'number',
};
