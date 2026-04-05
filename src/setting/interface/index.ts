import { IBase } from '@app/core/base/interface';
import { SettingKeyEnum } from '../enum';

export interface ISetting extends IBase {
  key: SettingKeyEnum;
  value: string | number | boolean;
}

export type FlatSettingsDto = Record<SettingKeyEnum, string | number | boolean>;
