import { Injectable } from '@nestjs/common';
import { AcademicRepository } from './academic.repository';
import { BaseService } from '@app/core/base/base.service';
import { DocumentService } from '@app/document/document.service';
import { Academic } from '@app/academic/entities/academic.entity';
const FILEABLE_TYPE = 'ACADEMIC';

@Injectable()
export class AcademicService extends BaseService<Academic> {
  constructor(
    private readonly academicRepository: AcademicRepository,
    private readonly documentService: DocumentService,
  ) {
    super(academicRepository);
  }

  async findAll(filterOptions: any, paginationOptions: any) {
    const [data, totalCount] = await this.academicRepository.findAll(
      filterOptions,
      paginationOptions,
    );
    return {
      data: await this.documentService.dataWithDocumentFiles(
        data,
        FILEABLE_TYPE,
      ),
      totalCount,
    };
  }
  async create(data: any) {
    const academics = await super.create(data);
    await this.saveDocumentFiles(academics['id'], data.documentFiles);
    return academics;
  }

  async findOne(id: number) {
    return this.academicRepository.findById(id);
  }

  async update(id: number, data: any) {
    await this.saveDocumentFiles(id, data.documentFiles);
    return this.academicRepository.update(id, data);
  }

  async delete(id: number) {
    await this.documentService.deleteDocumentFileByFileable(id, FILEABLE_TYPE);
    return this.academicRepository.delete(id);
  }

  async saveDocumentFiles(fileableId: any, documentFiles: any) {
    if (documentFiles?.length) {
      await this.documentService.createDocumentFilesByFileable(
        documentFiles,
        fileableId,
        FILEABLE_TYPE,
      );
    }
  }
}
