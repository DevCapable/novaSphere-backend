import { UserSettingKeyEnum } from '../enum';

export type FlatSettingsDto = Record<
  UserSettingKeyEnum,
  string | number | boolean
>;
