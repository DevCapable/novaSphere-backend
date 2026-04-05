import { Injectable } from '@nestjs/common';
import { GuidelineRepository } from './guideline.repository';
import { BaseService } from '@app/core/base/base.service';
import { DocumentService } from '@app/document/document.service';
import { Guideline } from '@app/guideline/entities/guideline.entity';
import { GUIDELINE_FILEABLE_TYPE } from '@app/guideline/interfaces';

@Injectable()
export class GuidelineService extends BaseService<Guideline> {
  documentFileType = GUIDELINE_FILEABLE_TYPE;

  constructor(
    private readonly guidelineRepository: GuidelineRepository,
    private readonly documentService: DocumentService,
  ) {
    super(guidelineRepository);
  }

  async delete(id: number) {
    await this.documentService.deleteDocumentFileByFileable(
      id,
      GUIDELINE_FILEABLE_TYPE,
    );

    return this.guidelineRepository.delete(id);
  }
}
