import { Injectable } from '@nestjs/common';
import { BaseService } from '@app/core/base/base.service';

import { DocumentService } from '@app/document/document.service';
import { Certification } from '@app/certification/entities/certification.entity';
import { CertificationRepository } from '@app/certification/certification.repository';

const FILEABLE_TYPE = 'CERTIFICATION';

@Injectable()
export class CertificationService extends BaseService<Certification> {
  constructor(
    private readonly certificationRepository: CertificationRepository,
    private readonly documentService: DocumentService,
  ) {
    super(certificationRepository);
  }
  async findAll(filterOptions: any, paginationOptions: any) {
    const [data, totalCount] = await this.certificationRepository.findAll(
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
    const certification = await super.create(data);
    await this.saveDocumentFiles(certification.id, data.documentFiles);
    return certification;
  }

  async update(id: number, data: any) {
    await this.saveDocumentFiles(id, data.documentFiles);
    return this.certificationRepository.update(id, data);
  }

  async delete(id: number) {
    await this.documentService.deleteDocumentFileByFileable(id, FILEABLE_TYPE);
    return this.certificationRepository.delete(id);
  }

  async saveDocumentFiles(fileableId, documentFiles) {
    if (documentFiles?.length) {
      await this.documentService.createDocumentFilesByFileable(
        documentFiles,
        fileableId,
        FILEABLE_TYPE,
      );
    }
  }
}
