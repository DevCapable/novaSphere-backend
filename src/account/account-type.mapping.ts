import { CreateInstitutionDto } from '@app/account/dto/institution/create-institution.dto';
import { UpdateInstitutionDto } from '@app/account/dto/institution/update-institution.dto';
import { CreateSugDto } from '@app/account/dto/sug/create-sug.dto'; // Ensure this path exists
import { UpdateSugDto } from '@app/account/dto/sug/update-sug.dto'; // Ensure this path exists
import {
  CreateAdminDto,
  CreateAuditorDto,
  CreateIndividualDto,
  CreateLecturerDto,
  UpdateAdminDto,
  UpdateAuditorDto,
  UpdateIndividualDto,
  UpdateLecturerDto,
} from './dto';
import { CreateCommunityVendorDto } from './dto/community-vendor/create-community-vendor.dto';
import { UpdateCommunityVendorDto } from './dto/community-vendor/update-community-vendor.dto';
import { AccountTypeEnum } from './enums';
import { CreateDepartmentDto } from '@app/department/dto/create-department.dto';
import { UpdateDepartmentDto } from '@app/department/dto/update-department.dto';

type Options = {
  fillable: string[];
  relations: string[];
  searchable: string[];
  createDto: any;
  updateDto: any;
};

export type AccountTypeMapping = Record<AccountTypeEnum, Options>;

export const accountTypeMapping: AccountTypeMapping = {
  [AccountTypeEnum.INSTITUTION]: {
    fillable: [
      'name',
      'shortName',
      'accountId',
      'institutionType',
      'ownershipType',
      'registrationNumber',
      'establishmentDate',
      'address',
      'phoneNumber',
      'email',
      'website',
      'vcOrRectorName',
      'registrarName',
      'stateId',
    ],
    relations: ['departments', 'account'],
    searchable: [
      'institution.name',
      'institution.shortName',
      'institution.institutionType',
      'institution.registrationNumber',
      'users.email',
    ],
    createDto: CreateInstitutionDto,
    updateDto: UpdateInstitutionDto,
  },
  [AccountTypeEnum.SUG]: {
    fillable: [
      'unionName',
      'acronym',
      'accountId',
      'institutionId',
      'presidentName',
      'generalSecretaryName',
      'officialEmail',
      'officialContactNumber',
      'officeAddress',
      'electionDate',
      'tenureEndDate',
      'isActive',
    ],
    relations: ['institution', 'account'],
    searchable: [
      'sug.unionName',
      'sug.acronym',
      'sug.presidentName',
      'sug.officialEmail',
    ],
    createDto: CreateSugDto,
    updateDto: UpdateSugDto,
  },
  [AccountTypeEnum.DEPARTMENT]: {
    fillable: [
      'name',
      'code',
      'description',
      'departmentType',
      'headOfDepartmentName',
      'isActive',
      'institutionId',
      'parentId',
      'uuid',
      'email',
      'phoneNumber',
      'accountType',
      'accountId',
    ],
    relations: ['institution', 'parent', 'account'], // Relations from the Department entity
    searchable: [
      'department.name',
      'department.code',
      'department.type',
      'institution.name', // Assuming institution is joined for search
    ],
    createDto: CreateDepartmentDto,
    updateDto: UpdateDepartmentDto,
  },
  [AccountTypeEnum.INDIVIDUAL]: {
    fillable: [
      'firstName',
      'lastName',
      'otherNames',
      'isExpatriate',
      'dob',
      'gender',
      'phoneNumber',
      'countryId',
      'nationalityId',
      'altEmail',
      'altPhoneNumber',
      'address',
      'stateId',
      'cityResidence',
      'stateResidenceForeign',
      'stateResidenceId',
      'lgaId',
      'homeTown',
      'employmentStatus',
      'currentEmployer',
      'dateEmployed',
      'ninNumber',
      'accountId',
      'uuid',
      'competencyId',
    ],
    relations: ['country', 'nationality', 'state', 'lga', 'stateResidence'],
    searchable: [
      'users.firstName',
      'users.lastName',
      'individual.firstName',
      'individual.lastName',
      'individual.phoneNumber',
      'individual.competencyId',
      'users.email',
    ],
    createDto: CreateIndividualDto,
    updateDto: UpdateIndividualDto,
  },
  [AccountTypeEnum.LECTURER]: {
    fillable: [
      'firstName',
      'lastName',
      'otherNames',
      'title', // Added Title (Prof, Dr, etc.)
      'isExpatriate',
      'dob',
      'gender',
      'phoneNumber',
      'staffNumber', // Added for Nigerian University tracking
      'ippisNumber', // Added for Federal payroll tracking
      'rank', // Added for Academic/Staff Level
      'highestQualification',
      'areaOfSpecialization',
      'countryId',
      'nationalityId',
      'stateOfOriginId', // Added for Federal Character compliance
      'altEmail',
      'altPhoneNumber',
      'address',
      'stateId',
      'cityResidence',
      'stateResidenceForeign',
      'stateResidenceId',
      'lgaId',
      'homeTown',
      'employmentStatus',
      'employmentType', // Added (Full-time, Visiting, etc.)
      'currentEmployer',
      'dateEmployed',
      'dateOfFirstAppointment',
      'ninNumber',
      'accountId',
      'uuid',
      'competencyId',
      'nextOfKinName',
      'nextOfKinPhone',
    ],
    relations: [
      'country',
      'nationality',
      // 'state',
      'lga',
      // 'stateResidence',
      'stateOfOrigin',
    ],
    searchable: [
      'users.email',
      'individual.firstName',
      'individual.lastName',
      'individual.staffNumber', // Highly searchable in Uni systems
      'individual.ippisNumber',
      'individual.phoneNumber',
      'individual.ninNumber',
    ],
    createDto: CreateLecturerDto,
    updateDto: UpdateLecturerDto,
  },
  [AccountTypeEnum.ADMIN]: {
    fillable: [
      'firstName',
      'lastName',
      'position',
      'workflowGroups',
      'phoneNumber',
      'accountId',
      'uuid',
    ],
    relations: [],
    searchable: [
      'users.firstName',
      'users.lastName',
      'admin.firstName',
      'admin.lastName',
      'users.email',
    ],
    createDto: CreateAdminDto,
    updateDto: UpdateAdminDto,
  },

  [AccountTypeEnum.COMMUNITY_VENDOR]: {
    fillable: [
      'name',
      'email',
      'address',
      'phoneNumber',
      'accountId',
      'stateId',
      'nogicNumber',
    ],
    relations: ['state'],
    searchable: ['communityVendor.name', 'communityVendor.nogicNumber'],
    createDto: CreateCommunityVendorDto,
    updateDto: UpdateCommunityVendorDto,
  },
  [AccountTypeEnum.AUDITOR]: {
    fillable: ['firstName', 'lastName', 'email', 'phoneNumber', 'accountId'],
    relations: [],
    searchable: [
      'auditor.firstName',
      'auditor.lastName',
      'users.email',
      'auditor.phoneNumber',
    ],
    createDto: CreateAuditorDto,
    updateDto: UpdateAuditorDto,
  },
};
