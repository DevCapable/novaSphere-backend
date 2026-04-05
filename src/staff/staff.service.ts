import { Injectable } from '@nestjs/common';
import { BaseService } from '@app/core/base/base.service';
import { Staff } from './entities/staff.entity';
import { StaffRepository } from './staff.repository';
import { BulkUploadRepository } from '@app/bulk-upload/bulk-upload.repository';
import { UserRepository } from '@app/user/user.repository';
import { AccountRepository } from '@app/account/account.repository';
import { MultiDeleteStaffDto } from './dto/multi-delete-staff.dto';
import { csvProcessing, generate, omit, sleep } from '@app/core/util';
import { AccountTypeEnum } from '@app/account/enums';
import { StaffTemplate } from './utils/template.interface';
import { expatriateStaffTemplateSchema } from './utils/expartriate-template.schema';
import { nigerianStaffTemplateSchema } from './utils/nigerian-template.schema';
import { UploadableType } from '@app/bulk-upload/entities/bulk-upload.entity';
import {
  BaseRecordEnum,
  BaseRecordEnum as BaseRecordType,
} from '@app/base-record/entities/base-record.entity';
import { EntityManager, ILike, Repository } from 'typeorm';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRecordRepository } from '@app/base-record/base-record.repository';
import { v4 as uuidv4 } from 'uuid';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@app/core/config/aws.config';
import { MultiUnarchiveStaffDto } from './dto/multi-restore-staff';
import { StaffQueue } from './interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BulkUploadEvent,
  UploadModuleName,
  UploadStatus,
} from '@app/bulk-upload/enum';
import {
  CustomBadRequestException,
  CustomNotFoundException,
} from '@app/core/error';
import { StringHelper } from '@app/core/helpers';
import { BulkUploadProgressService } from '@app/bulk-upload/bulk-upload-progress.service';
@Injectable()
export class StaffService extends BaseService<Staff> {
  constructor(
    private readonly staffRepository: StaffRepository,
    @InjectRepository(Staff)
    private readonly staffQuery: Repository<Staff>,
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly bulkUploadRepository: BulkUploadRepository,
    private readonly baseRecordService: BaseRecordRepository,
    private readonly entityManager: EntityManager,
    private readonly bulkUploadProgressService: BulkUploadProgressService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(staffRepository);
  }

  async createStaff(data) {
    try {
      const { accountId, uploadRef, ...mainData } = data;
      if (data.entry === 'single') {
        return await this._createSingle(mainData, accountId);
      } else if (data.entry === 'bulk') {
        this.bulkUploadProgressService.sendProgressUpdate({
          accountId,
          uploadRef,
          status: UploadStatus.START,
          moduleName: UploadModuleName.STAFF,
        });
        const payloadToQueue = {
          template: data.template,
          uploadRef,
          keys: data.documentFiles.map((file) => file.awsKey),
          accountId: data.accountId,
          moduleKey: UploadModuleName.STAFF,
          handler: 'createBulk',
        };

        this.eventEmitter.emit(BulkUploadEvent.GENERIC, payloadToQueue);
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll(filterOptions, paginationOptions) {
    const [data, totalCount] = await this.staffRepository.findAll(
      filterOptions,
      paginationOptions,
    );
    return { data, totalCount };
  }

  async findIndividuals(filterOptions, paginationOptions) {
    const [data, totalCount] = await this.accountRepository.findIndividuals(
      filterOptions,
      paginationOptions,
    );

    const transformedData = data?.map((account) => {
      return {
        id: account?.id,
        name: `${account?.individual?.firstName} ${account?.individual?.lastName}`,
        nationality: account?.individual?.nationality,
        email: account?.users?.[0]?.email,
      };
    });

    return {
      data: transformedData,
      totalCount,
    };
  }

  async findOne(id: number) {
    return await this.staffRepository.findById(id);
  }

  async update(id: number, data) {
    try {
      let updateData = omit(data, ['accountId', 'countryId']);

      if (data?.firstName) {
        updateData = {
          ...updateData,
          firstName: data.firstName.toUpperCase().trim(),
        };
      }

      if (data?.lastName) {
        updateData = {
          ...updateData,
          lastName: data.lastName.toUpperCase().trim(),
        };
      }

      if (data?.email) {
        updateData = {
          ...updateData,
          email: data.email.toLowerCase().trim(),
        };
      }

      const staffData = await this.staffRepository.findById(id);
      if (!staffData) {
        throw new CustomNotFoundException('Record not found');
      }

      const updateStaffPromise = this.staffRepository.update(id, updateData);

      const updateAccountPromise = this.accountRepository.update(
        staffData.individualAccountId,
        updateData,
      );
      const updateUserPromise = this.userRepository.update(
        staffData.individualAccount.users[0].id,
        updateData,
      );

      await Promise.all([
        updateStaffPromise,
        updateAccountPromise,
        updateUserPromise,
      ]);

      return updateStaffPromise;
    } catch (error) {
      throw error;
    }
  }

  async unarchive(id: number) {
    const staff = await this.findOne(id);
    if (!staff) {
      throw new CustomNotFoundException('Staff Not Found');
    }
    await this.staffRepository.update(id, { deletedAt: null });
  }

  async unarchiveAll(data: MultiUnarchiveStaffDto) {
    try {
      await Promise.all(
        data.selectedRows.map(async (staffId) => {
          await this.staffRepository.update(staffId, {
            deletedAt: null,
          });
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteStaff(id: number) {
    return this.staffRepository.deleteStaff(id);
  }

  async multiDelete(data: MultiDeleteStaffDto) {
    try {
      await Promise.all(
        data.selectedRows.map(async (staffId) => {
          await this.staffRepository.deleteStaff(staffId);
        }),
      );
      return 'Successfully deleted.';
    } catch (error) {
      throw error;
    }
  }

  private async _createSingle(data: any, accountId: number) {
    if (!data.individualAccountId) {
      return this.createStaffAndAccount(data, accountId);
    }

    const individualAccountIdNumber = Number(data.individualAccountId);
    if (isNaN(individualAccountIdNumber)) {
      throw new CustomBadRequestException(
        'Invalid IndividualId. Expected a valid number.',
      );
    }

    const individualAccount = await this.accountRepository.findById(
      individualAccountIdNumber,
    );

    const existingStaff = await this.staffRepository.findFirst({
      accountId: individualAccountIdNumber,
    });

    if (existingStaff) {
      throw new CustomBadRequestException(`Staff already exists`);
    }

    if (individualAccount.type !== 'INDIVIDUAL') {
      throw new CustomBadRequestException(
        'The account type is not INDIVIDUAL account',
      );
    }

    const jobTypeId = await this._findOrCreateBaseRecord(data.jobTypeId);
    return this.staffRepository.create({
      ...data,
      jobTypeId,
      accountId,
      uuid: uuidv4(),
    });
  }
  async createBulk(data: StaffQueue) {
    if (
      data.template === StaffTemplate.NIGERIAN ||
      data.template === StaffTemplate.EXPATRIATES
    ) {
      const totalFiles = data.keys.length;
      let currentFile = 0;

      for (const payload of data.keys) {
        currentFile++;
        this.bulkUploadProgressService.sendProgressUpdate({
          accountId: data.accountId,
          uploadRef: data.uploadRef,
          status: UploadStatus.UPLOADING,
          currentFile,
          totalFiles,
          moduleName: UploadModuleName.STAFF,
        });

        try {
          const templateSchema =
            data.template === StaffTemplate.EXPATRIATES
              ? expatriateStaffTemplateSchema
              : nigerianStaffTemplateSchema;

          const {
            totalChunkProcessed,
            totalFailedChunks,
            errorLog,
            total,
            validRows,
          } = await this._processCsvFile(
            payload,
            templateSchema,
            data.template === StaffTemplate.EXPATRIATES,
            data.accountId,
            currentFile,
            totalFiles,
            data.uploadRef,
          );

          const status =
            totalFailedChunks > 0
              ? `Completed with ${totalFailedChunks} error(s)`
              : 'Completed';

          await this._createOrUpdateBulkUpload({
            accountId: data.accountId,
            filePath: payload,
            uploadableType: UploadableType.STAFF,
            status,
            totalFailed: totalFailedChunks,
            totalImported: totalChunkProcessed,
            total,
            messageLog: StringHelper.stringify(errorLog),
          });

          console.log(totalFailedChunks, validRows, 'checking');

          if (totalFailedChunks > 0) {
            const errorMessage = `Bulk upload failed with ${totalFailedChunks} error(s). Please check the error log in the bulk upload page for details.`;
            this.bulkUploadProgressService.sendProgressUpdate({
              accountId: data.accountId,
              uploadRef: data.uploadRef,
              status: UploadStatus.FAILED,
              moduleName: UploadModuleName.STAFF,
              msg: errorMessage,
            });
          } else {
            if (validRows && validRows.length > 0) {
              for (const staffData of validRows) {
                await this.createStaffAndAccount(staffData, data.accountId);
              }
            }
            this.bulkUploadProgressService.sendProgressUpdate({
              accountId: data.accountId,
              uploadRef: data.uploadRef,
              status: UploadStatus.COMPLETED,
              currentFile,
              totalFiles,
              moduleName: UploadModuleName.STAFF,
            });
          }
        } catch (error: any) {
          const errorMessage = `Error processing file ${currentFile} of ${totalFiles}: ${error?.resposne?.message || 'Please check error log in the bulk upload page details'}`;

          this.bulkUploadProgressService.sendProgressUpdate({
            accountId: data.accountId,
            uploadRef: data.uploadRef,
            status: UploadStatus.FAILED,
            currentFile,
            totalFiles,
            moduleName: UploadModuleName.STAFF,
            msg: errorMessage,
          });
        }
      }
    }
  }

  private async _processCsvFile(
    payload: any,
    templateSchema: any,
    isExpatriate: boolean,
    accountId: number,
    currentFile: number,
    totalFiles: number,
    uploadRef: string,
  ): Promise<any> {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `files/${payload}`,
    };

    const errorLog = [];
    let totalChunkProcessed = 0;
    let totalFailedChunks = 0;
    let totalRows = 0;
    const validRows = [];

    try {
      const command = new GetObjectCommand(params);
      const { Body } = await s3Client.send(command);

      if (!Body || !(Body instanceof Readable)) {
        errorLog.push({
          row: 0,
          error: {
            error: 'No data found in S3 object or data is not readable',
            column: '',
            rowValue: '',
          },
        });
        return {
          totalChunkProcessed,
          totalFailedChunks: 1,
          errorLog,
          total: 0,
        };
      }

      const buffer = await this.streamToBuffer(Body);
      const inputData = csvProcessing(buffer, templateSchema);
      if (!inputData.payload.length && inputData.failedRows.length) {
        inputData.failedRows.forEach((el) => {
          const errorValue = {
            error: el.error,
            column: el?.column || '',
            rowValue: el?.value || '',
          };
          errorLog.push({ row: el.row + 1, errors: [errorValue] });
        });
        return {
          totalChunkProcessed: inputData.failedRows.length,
          totalFailedChunks: inputData.failedRows.length,
          errorLog,
          total: inputData.failedRows.length,
        };
      }

      totalRows = inputData.payload.length;
      const rs = Readable.from(generate(inputData.payload));
      let currentRow = 0;

      for await (const chunk of rs) {
        await sleep(2000);
        currentRow++;

        this.bulkUploadProgressService.sendProgressUpdate({
          accountId,
          uploadRef,
          status: UploadStatus.UPLOADING,
          currentRow,
          totalRows,
          currentFile,
          totalFiles,
          moduleName: UploadModuleName.STAFF,
        });

        try {
          const { rowErrors, payload } = await this._processCsvRow(
            chunk,
            templateSchema,
            isExpatriate,
          );

          if (rowErrors.errors.length > 0) {
            totalFailedChunks++;
            errorLog.push(rowErrors);
          } else {
            totalChunkProcessed++;
            if (payload) {
              validRows.push(payload);
            }
          }
        } catch (rowProcessingError: any) {
          totalFailedChunks++;
          errorLog.push({
            row: currentRow,
            error: {
              error: `Error processing row: ${rowProcessingError?.response?.message || 'rowProcessingError'}`,
              column: '',
              rowValue: '',
            },
          });
        }
      }

      return {
        totalChunkProcessed,
        totalFailedChunks,
        errorLog,
        total: totalRows,
        validRows,
      };
    } catch (error: any) {
      errorLog.push({
        row: 0,
        error: {
          error: `Error processing: ${error?.response?.message || 'Processing Error'}`,
          column: '',
          rowValue: '',
        },
      });

      return {
        totalChunkProcessed: totalRows || 1,
        totalFailedChunks: totalRows || 1,
        errorLog,
        total: totalRows,
      };
    }
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  private async _processCsvRow(
    row: any,
    templateSchema: any,
    isExpatriate: boolean,
  ): Promise<any> {
    const rowErrors = { row: row.rowId + 2, errors: [] };
    // Validation and data processing logic for a single row
    const normalizedEmail = row.email.trim().toLowerCase();
    const emailExist = await this.staffQuery
      .createQueryBuilder('staff')
      .leftJoin('staff.individualAccount', 'individualAccount')
      .leftJoin('individualAccount.users', 'users')
      .where('LOWER(users.email) = :email', { email: normalizedEmail })
      .getOne();

    if (emailExist) {
      rowErrors.errors.push({
        error: `The email address "${row.email}" already exists in the system.`,
        column: 'email',
        rowValue: row.email,
      });
    } else {
      if (row.isManagement) {
        row.isManagement =
          row.isManagement.toUpperCase().trim() === 'YES' ? true : false;
      }

      row.isExpatriate = isExpatriate;
      row.firstName = row.firstName.toUpperCase().trim();
      row.lastName = row.lastName.toUpperCase().trim();
      row.otherName = row.otherName?.toUpperCase().trim();
      row.email = row.email.toLowerCase().trim();

      const fieldsToCheck = [
        {
          key: 'jobType',
          type: BaseRecordType.JOB_FAMILY,
          idField: 'jobTypeId',
          schemaValue: 'JOB TITLE*',
        },
        {
          key: 'employmentNature',
          type: BaseRecordType.NATURE_OF_EMPLOYMENT,
          idField: 'employmentNatureId',
          schemaValue: 'NATURE OF EMPLOYMENT*',
        },
        {
          key: 'lga',
          type: BaseRecordType.LGA,
          idField: 'lgaId',
          schemaValue: 'LOCAL GOVERNMENT AREA*',
        },
        {
          key: 'state',
          type: BaseRecordType.STATE,
          idField: 'stateId',
          schemaValue: 'STATE*',
        },
        {
          key: 'nationality',
          type: BaseRecordType.NATIONALITY,
          idField: 'nationalityId',
          schemaValue: 'NATIONALITY*',
        },
        {
          key: 'educationLevel',
          type: BaseRecordType.EDUCATION_LEVEL,
          idField: 'educationLevelId',
          schemaValue: 'HIGHEST EDUCATION LEVEL*',
        },
      ];

      const expatriateCompulsoryFields = [
        'nationality',
        'employmentNature',
        // 'jobType',
      ];
      const nigerianCompulsoryFields = [
        'state',
        'employmentNature',
        'lga',
        'educationLevel',
        // 'jobType',
      ];
      const compulsoryCheckFields = isExpatriate
        ? expatriateCompulsoryFields
        : nigerianCompulsoryFields;

      let validRow = true;

      for (const field of compulsoryCheckFields) {
        const fieldData = fieldsToCheck.find((data) => data.key === field);

        if (!row[field]) {
          validRow = false;
          rowErrors.errors.push({
            error: `The field "${field}" is missing. Please provide a value for "${fieldData.schemaValue}".`,
            column: field,
            rowValue: validRow[field],
          });
        }

        if (fieldData) {
          // initial payload and replaced single quotes
          const sanitizedPayload = row[fieldData.key]
            .trim()
            .replace(/[']/g, ' ');

          // perform the initial search
          let record = await this.baseRecordService.findFirstBy({
            type: fieldData.type,
            name: ILike(sanitizedPayload.toLowerCase()),
          });

          // if no record found, perform a second search with the original payload
          if (!record) {
            const originalPayload = row[fieldData.key].trim();
            record = await this.baseRecordService.findFirstBy({
              type: fieldData.type,
              name: ILike(originalPayload.toLowerCase()),
            });
          }

          // handle result
          if (!record) {
            validRow = false;
            rowErrors.errors.push({
              error: `The value "${row[fieldData.key]}" is invalid for the field "${fieldData.schemaValue}".`,
              column: fieldData.key,
              rowValue: row[fieldData.key],
            });
          } else {
            row[fieldData.idField] = record.id;
          }
        }
      }

      if (!validRow) {
        return { rowErrors, payload: null };
      }

      for (const fieldData of fieldsToCheck) {
        if (
          !compulsoryCheckFields.includes(fieldData.key) &&
          row[fieldData.key]
        ) {
          const payload = row[fieldData.key].trim().replace(/[']/g, ' ');
          let record = await this.baseRecordService.findFirstBy({
            type: fieldData.type,
            name: ILike(payload.toLowerCase()),
          });

          if (!record) {
            record = await this.baseRecordService.create({
              type: fieldData.type,
              name: payload,
              uuid: uuidv4(),
            });
          }

          if (record) {
            row[fieldData.idField] = record.id;
          }
        }
        delete row[fieldData.key];
      }

      if (!row.nationalityId) {
        const defaultNationality = await this.baseRecordService.findFirstBy({
          type: BaseRecordEnum.NATIONALITY,
          name: ILike('Nigerian'),
        });

        if (defaultNationality) {
          row['nationalityId'] = defaultNationality.id;
        }
      }
    }
    return { rowErrors, payload: row };
  }

  private async _createOrUpdateBulkUpload({
    accountId,
    filePath,
    uploadableType,
    status,
    totalFailed,
    totalImported,
    total,
    messageLog,
  }: {
    accountId: number;
    filePath: string;
    uploadableType: UploadableType;
    status: string;
    totalFailed: number;
    totalImported: number;
    total: number;
    messageLog: any;
  }): Promise<void> {
    try {
      const newBulkUpload = await this.bulkUploadRepository.create({
        accountId,
        filePath,
        uploadableType,
        status,
        uuid: uuidv4(),
      });

      await this._updateStatusAndLog(
        newBulkUpload.id,
        status,
        totalFailed,
        totalImported,
        total,
        messageLog,
      );
    } catch (error) {
      throw error;
    }
  }

  private async _updateStatusAndLog(
    uploadId: number,
    status: string,
    totalFailed: number,
    totalImported: number,
    total: number,
    messageLog: any[],
  ): Promise<void> {
    try {
      if (totalFailed > 0) {
        await this.bulkUploadRepository.update(uploadId, {
          totalFailed,
          totalImported,
          total,
          status: `Completed with ${totalFailed} errors`,
          messageLog,
        });
      } else {
        await this.bulkUploadRepository.update(uploadId, {
          totalFailed: 0,
          totalImported,
          total,
          status: 'Completed',
          messageLog: '[]',
        });
      }
    } catch (error) {
      throw error;
    }
  }

  private async createStaffAndAccount(mainData, accountId) {
    return this.entityManager.transaction(async (entityManager) => {
      const normalizedEmail = mainData.email.trim().toLowerCase();

      let user = await this.userRepository.findFirst({
        email: normalizedEmail,
      });
      if (!user) {
        user = await this.userRepository.create({ ...mainData }, entityManager);
      }
      let individualAccount = await this.accountRepository.findFirst(
        {
          users: { id: user.id },
          type: AccountTypeEnum.INDIVIDUAL,
        },
        ['users'],
      );

      if (!individualAccount) {
        individualAccount = await this.accountRepository.create(
          {
            ...mainData,
            accountType: AccountTypeEnum.INDIVIDUAL,
            users: [user],
          },
          entityManager,
        );
      }

      const existingStaff = await this.staffRepository.findFirst({
        individualAccountId: individualAccount.id,
      });

      if (existingStaff) {
        throw new CustomBadRequestException(
          `A staff member with email ${normalizedEmail} already exists.`,
        );
      }
      const jobTypeId = await this._findOrCreateBaseRecord(mainData.jobTypeId);
      await this.staffRepository.create(
        {
          ...mainData,
          accountId,
          uuid: uuidv4(),
          individualAccountId: individualAccount.id,
          isManagement: mainData.isManagement,
          jobTypeId,
        },
        entityManager,
      );
    });
  }

  private async _findOrCreateBaseRecord(
    value: any,
    type = BaseRecordEnum.JOB_TYPE,
  ) {
    if (!isNaN(value)) {
      return +value;
    } else {
      const baseRecord = await this.baseRecordService.findOrCreate({
        name: value,
        type,
      });
      return baseRecord.id;
    }
  }
}
