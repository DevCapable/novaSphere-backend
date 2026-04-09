import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { Admin, Position } from '../account/entities/admin.entity';
import { Institution } from '../account/entities/institution.entity'; // Changed from Company
import { Sug } from '../account/entities/sug.entity'; // Added Sug
import { Individual } from '../account/entities/individual.entity';
import { Auditor } from '../account/entities/auditor.entity';
import { CommunityVendor } from '../account/entities/community-vendor.entity';
import { BaseRecord } from '../base-record/entities/base-record.entity';
import { generateRandomCode } from '../core/util';
import { BcryptService } from '@app/user/hashing/bcrypt.service';
import { Role } from '@app/role/entities/role.entity';
import { v4 as uuidv4 } from 'uuid';
import { RolesEnum } from '@app/role/enums';
import { LoggerService } from '@app/logger';
import {
  AccountTypeEnum,
  InstitutionTypeEnum,
  OwnershipType,
} from '@app/account/enums';
import { Department } from '@app/account/entities/department.entity';

const hashService = new BcryptService();

@Injectable()
export class UserSeeder implements SeederInterface {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Account) private readonly account: Repository<Account>,
    @InjectRepository(Admin) private readonly admin: Repository<Admin>,
    @InjectRepository(Institution)
    private readonly institution: Repository<Institution>,
    @InjectRepository(Sug) private readonly sug: Repository<Sug>,
    @InjectRepository(Individual)
    private readonly individual: Repository<Individual>,
    @InjectRepository(Department)
    private readonly department: Repository<Department>,
    @InjectRepository(Auditor)
    private readonly auditor: Repository<Auditor>,
    @InjectRepository(CommunityVendor)
    private readonly communityVendor: Repository<CommunityVendor>,
    @InjectRepository(BaseRecord)
    private readonly baseRecord: Repository<BaseRecord>,
    @InjectRepository(Role) private readonly role: Repository<Role>,
    private readonly entityManager: EntityManager,
    private readonly loggerService: LoggerService,
  ) {}

  async createAccount(
    accountType: AccountTypeEnum,
    userData: any,
    accountData: any,
  ) {
    const uniqueUser = await this.user.findOne({
      where: { email: userData.email },
    });
    if (uniqueUser) return;

    await this.entityManager.transaction(async (manager: EntityManager) => {
      const user = await manager.save(User, {
        ...userData,
        password: await hashService.hash('password'),
        nogicNumber: generateRandomCode(8),
        isActivated: true,
        uuid: uuidv4(),
      });
      await this.create(
        { ...accountData, accountType, users: [user] },
        manager,
      );
    });
  }

  async create(data: any, entityManager: EntityManager): Promise<any> {
    const nogicNumber = generateRandomCode(8);
    const userData = {
      ...data,
      nogicNumber,
      type: data.accountType,
      uuid: uuidv4(),
    };

    const account = await entityManager.save(Account, userData);
    const accountData = { ...userData, accountId: account.id, uuid: uuidv4() };

    switch (data.accountType) {
      case AccountTypeEnum.INDIVIDUAL:
        await entityManager.save(Individual, accountData);
        break;
      case AccountTypeEnum.INSTITUTION:
        await entityManager.save(Institution, accountData);
        break;
      case AccountTypeEnum.SUG:
        await entityManager.save(Sug, accountData);
        break;
      case AccountTypeEnum.ADMIN:
        await entityManager.save(Admin, accountData);
        break;
      case AccountTypeEnum.DEPARTMENT:
        await entityManager.save(Department, accountData);
        break;
      case AccountTypeEnum.AUDITOR:
        await entityManager.save(Auditor, accountData);
        break;
      case AccountTypeEnum.COMMUNITY_VENDOR:
        await entityManager.save(CommunityVendor, accountData);
        break;
    }
    return account;
  }

  async createInstitutionAccount() {
    const role = await this.role.findOne({
      where: { slug: RolesEnum.SUPER_ADMIN },
    });
    const accountData = {
      name: 'University of Ilorin',
      shortName: 'UNILAG',
      institutionType: InstitutionTypeEnum.UNIVERSITY,
      ownershipType: OwnershipType.FEDERAL,
      registrationNumber: 'NUC/UNIV/002/2023',
      establishmentDate: new Date('1962-10-03'),
      email: 'institution@novasphere.edu.ng',
      phoneNumber: '08012345678',
      address: 'Akoka, Yaba, Lagos',
    };

    const userData = {
      firstName: accountData.shortName,
      lastName: 'OFFICIAL',
      email: accountData.email,
      roles: [role],
    };

    return await this.createAccount(
      AccountTypeEnum.INSTITUTION,
      userData,
      accountData,
    );
  }

  async createSugAccount() {
    // Find the institution to link the SUG to
    const institution = await this.institution.findOne({
      where: { shortName: 'UNILAG' },
    });
    const role = await this.role.findOne({
      where: { slug: RolesEnum.SUPER_ADMIN },
    });

    const accountData = {
      unionName: 'UNILAG Student Union Government',
      acronym: 'ULSU',
      institutionId: institution?.accountId,
      presidentName: 'COMRADE ADEBAYO',
      officialEmail: 'sug@unilag.edu.ng',
      officialContactNumber: '08099998888',
      officeAddress: 'SUG Secretariat, Unilag',
    };

    const userData = {
      firstName: accountData.acronym,
      lastName: 'PRESIDENT',
      email: accountData.officialEmail,
      roles: [role],
    };

    return await this.createAccount(AccountTypeEnum.SUG, userData, accountData);
  }

  async createIndividualAccount() {
    const role = await this.role.findOne({
      where: { slug: RolesEnum.SUPER_ADMIN },
    });

    const nationality = await this.baseRecord.findOne({
      where: { name: 'NIGERIAN' },
    });
    const country = await this.baseRecord.findOne({
      where: { name: 'NIGERIA' },
    });

    const accountData = {
      firstName: 'JOHN',
      lastName: 'DOE',
      email: 'johndoe@example.com',
      phoneNumber: '08011112222',
      dob: new Date('1990-01-01'),
      gender: 'MALE',
      nationalityId: nationality?.id,
      countryId: country?.id,
    };

    const userData = {
      ...accountData,
      roles: role ? [role] : [],
    };

    return await this.createAccount(
      AccountTypeEnum.INDIVIDUAL,
      userData,
      accountData,
    );
  }

  async createAuditorAccount() {
    const role = await this.role.findOne({
      where: { slug: RolesEnum.SUPER_ADMIN },
    });
    const accountData = {
      firstName: 'AUDIT',
      lastName: 'OFFICER',
      email: 'auditor@novasphere.edu.ng',
      phoneNumber: '08022223333',
      address: 'Lagos, Nigeria',
    };

    const userData = {
      ...accountData,
      roles: role ? [role] : [],
    };

    return await this.createAccount(
      AccountTypeEnum.AUDITOR,
      userData,
      accountData,
    );
  }

  async createCommunityVendorAccount() {
    const role = await this.role.findOne({
      where: { slug: RolesEnum.SUPER_ADMIN },
    });
    const accountData = {
      name: 'Global Tech Solutions',
      email: 'vendor@globaltech.com',
      phoneNumber: '08033334444',
      address: 'Ikeja, Lagos',
    };

    const userData = {
      firstName: 'GLOBAL',
      lastName: 'VENDOR',
      email: accountData.email,
      roles: role ? [role] : [],
    };

    return await this.createAccount(
      AccountTypeEnum.COMMUNITY_VENDOR,
      userData,
      accountData,
    );
  }

  async createDepartmentAccount() {
    const role = await this.role.findOne({
      where: { slug: RolesEnum.SUPER_ADMIN },
    });
    // Find an existing institution to link the department to, if desired
    const institution = await this.institution.findOne({
      where: { shortName: 'UNILAG' },
    });

    const accountData = {
      name: 'Computer Science Department',
      email: 'department@unilag.edu.ng',
      phoneNumber: '08044445555',
      address: 'Faculty of Science, UNILAG',
      institutionId: institution?.accountId, // Link to UNILAG if found
      departmentType: 'ACADEMIC_DEPT',
    };

    const userData = {
      firstName: 'COMPUTER SCIENCE',
      lastName: 'HOD',
      email: accountData.email,
      roles: role ? [role] : [],
    };

    return await this.createAccount(
      AccountTypeEnum.DEPARTMENT,
      userData,
      accountData,
    );
  }

  async createAdminAccount() {
    const role = await this.role.findOne({
      where: { slug: RolesEnum.SUPER_ADMIN },
    });
    const userData = {
      firstName: 'SYSTEM',
      lastName: 'ADMIN',
      email: 'admin@novasphere.edu.ng',
      roles: [role],
    };

    const accountData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      position: Position.PO,
    };

    return await this.createAccount(
      AccountTypeEnum.ADMIN,
      userData,
      accountData,
    );
  }

  async seed() {
    try {
      this.loggerService.log('Seeding Administrative Data...');
      await this.createAdminAccount();

      this.loggerService.log('Seeding Institution Data...');
      await this.createInstitutionAccount();

      this.loggerService.log('Seeding SUG Data...');
      await this.createSugAccount();

      this.loggerService.log('Seeding Individual Data...');
      await this.createIndividualAccount();

      this.loggerService.log('Seeding Department Data...');
      await this.createDepartmentAccount();

      this.loggerService.log('Seeding Auditor Data...');
      await this.createAuditorAccount();

      this.loggerService.log('Seeding Community Vendor Data...');
      await this.createCommunityVendorAccount();

      this.loggerService.log('Seeding completed successfully.');
    } catch (e: any) {
      this.loggerService.error('Seeding failed: ' + e.message);
    }
  }
}
