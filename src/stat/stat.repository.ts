import { AccountRepository } from '@app/account/account.repository';
import { AccountTypeEnum } from '@app/account/enums';
import { Injectable } from '@nestjs/common';
import { DocumentFileRepository } from '@app/document/repository';
import { StaffRepository } from '@app/staff/staff.repository';

@Injectable()
export class StatRepository {
  constructor(
    private readonly accountRepository: AccountRepository,

    private readonly documentFileRepository: DocumentFileRepository,
    private readonly staffRepository: StaffRepository,
  ) {}

  async findStats(id: number) {
    const account = await this.accountRepository.findOne(id);

    const where = {
      accountId: id,
    };

    if (account.type === AccountTypeEnum.INDIVIDUAL) {
      return {};
    }

    if (account.type === AccountTypeEnum.INSTITUTION) {
      const documentFiles = await this.documentFileRepository.findAllBy({
        fileableId: id,
        fileableType: 'OWNERSHIP_DOCUMENT',
      });

      return {
        ownershipDocuments: documentFiles?.length || 0,
        staff: await this.staffRepository.countForStats(id),
      };
    }
  }

  findIndividualAccountRelations(accountId: number) {
    // const academics = await this.academicRepository.findMany(accountId);

    return {
      // academics,
    };
  }

  findCompanyAccountRelations(accountId: number) {
    // const services = await this.servicesRepository.findMany(accountId);

    return {
      // services,
    };
  }
}
