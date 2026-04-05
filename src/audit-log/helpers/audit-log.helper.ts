import { AuditLogChanges } from '../interfaces';
import _ from 'lodash';

export class AuditLogHelper {
  static readonly SKIP_KEYS = [
    'createdAt',
    'updatedAt',
    'id',
    'uuid',
    'parentId',
  ];

  static compareChanges(
    oldData: any,
    newData: any,
    changeKeys: string[] = [],
    parentKey = '',
  ): Record<string, AuditLogChanges<any>> {
    const changes: Record<string, AuditLogChanges<any>> = {};

    if (_.isNil(oldData) && !_.isNil(newData)) {
      changes[parentKey || 'root'] = {
        oldData: oldData,
        newData: newData,
      };
      return changes;
    }

    const keysToCheck =
      changeKeys.length > 0 ? changeKeys : Object.keys(newData);

    _.forEach(keysToCheck, (key) => {
      if (this.shouldSkipKey(key)) return;

      const oldValue = oldData?.[key];
      const newValue = newData[key];
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (_.isArray(newValue)) {
        changes[fullKey] = { oldData: null, newData: null };
      } else if (
        _.isObject(newValue) &&
        !_.isArray(newValue) &&
        !changeKeys.includes(key)
      ) {
        const nestedChanges = this.compareChanges(
          oldValue,
          newValue,
          [],
          fullKey,
        );
        if (!_.isEmpty(nestedChanges)) {
          Object.assign(changes, nestedChanges);
        }
      } else if (!_.isEqual(newValue, oldValue)) {
        changes[fullKey] = {
          oldData: typeof oldValue === 'boolean' ? String(oldValue) : oldValue,
          newData: typeof newValue === 'boolean' ? String(newValue) : newValue,
        };
      }
    });

    return changes;
  }

  static extractChangedFields(data: any, changes: Record<string, any>) {
    const changedFields: any = {};
    _.forEach(changes, (change, key) => {
      const field = key.split('.').slice(-1)[0];
      if (!this.shouldSkipKey(field)) {
        changedFields[field] = this.isPrimitive(data?.[field])
          ? data?.[field]
          : null;
      }
    });
    return changedFields;
  }

  static isPrimitive(value: any): boolean {
    return (
      _.isString(value) ||
      _.isNumber(value) ||
      _.isBoolean(value) ||
      _.isNull(value)
    );
  }

  static shouldSkipKey(key: string): boolean {
    const startsWithId = /^id/i.test(key);
    const endsWithId = /Id$/i.test(key);

    return this.SKIP_KEYS.includes(key) || startsWithId || endsWithId;
  }
}
