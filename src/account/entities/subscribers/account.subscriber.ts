import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Account } from '@app/account/entities/account.entity';
import { AccountTypeEnum } from '@app/account/enums';

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Account;
  }

  afterLoad(entity: Account): Promise<any> | void {
    let name = '';

    switch (entity.type) {
      case AccountTypeEnum.INSTITUTION:
        // Use the tertiary institution name (e.g., University of Lagos)
        name = entity.institution?.name || '';
        break;

      case AccountTypeEnum.SUG:
        // Use the Student Union name (e.g., UNILAG SUG)
        name = entity.sug?.unionName || '';
        break;

      case AccountTypeEnum.INDIVIDUAL:
        name =
          `${entity.individual?.firstName ?? ''} ${entity.individual?.lastName ?? ''}`.trim();
        break;

      case AccountTypeEnum.ADMIN:
        name =
          `${entity.admin?.firstName ?? ''} ${entity.admin?.lastName ?? ''}`.trim();
        break;

      case AccountTypeEnum.COMMUNITY_VENDOR:
        name = entity.communityVendor?.name || '';
        break;

      default:
        name = 'Unknown Account';
    }

    // Assign the derived name to the transient property on the entity
    entity.name = name;
  }
}
