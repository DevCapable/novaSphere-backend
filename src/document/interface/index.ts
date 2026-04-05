import { CurrentUserData } from '@app/iam/interfaces';
import { DocumentReviewStatus } from '@app/review/entities/document-review.entity';
import { Request } from 'express';
import { DocumentType } from '../enum/document.enum';

export interface IDocumentFile {
  filePath: string;
  awsKey: string;
  mimeType?: string;
  size?: number;
  documentId?: number;
  accountId?: number;
  accountName?: string;
  id?: number;
  document?: IDocument;
}

export interface IDocument {
  name: string;
  slug: string;
  type: string;
  isRequired: number;
  allowedFormats: string | null;
  description: string | null;
  order: number;
}

export interface IDocumentReview {
  reviewableType: DocumentType;
  status: DocumentReviewStatus;
  remark?: string;
  documentId: number;
  userId: number;
  reviewableId: number;
}

export interface IDocumentWithFilesAndReviews extends IDocument {
  documentFiles: IDocumentFile[];
  reviews: any[];
}

export interface CreateDocumentFilePayload extends IDocumentFile {
  fileableId: number;
  fileableType: string;
}

export interface UpdateDocumentFilePayload extends CreateDocumentFilePayload {}

export interface DocumentFilablePayload {
  fileableId: number;
  fileableType: string;
}

export interface DocumentsFilablePayloadUser {
  documentType: DocumentType;
  fileableId: number;
  fileableType: string;
  currentUser?: CurrentUserData;
}

export interface DocumentCreate {
  name: string;
  format: string[];
  description?: string;
  isRequired?: boolean;
  order?: number;
  slug?: string;
  id?: number;
  allowedFormats?: string;
}

export interface ICreateDocument {
  type: DocumentType;
  documents: DocumentCreate[];
  ip?: string;
  userId?: number;
}

export interface ICreateDocumentFileDto {
  documentFiles: IDocumentFile[];
  fileableId: number;
  fileableType: DocumentType;
  documentId: number;
  accountId?: number;
}

export interface IDocumentUploadDto {
  documents: string;
}

export interface IDocumentDto {
  name: string;
  filePath: string;
  awsKey: string;
}

export interface ICreateDocumentReview {
  userId: number;
  documentId: number;
  remark?: string;
  reviewableType: DocumentType;
  reviewableId: number;
  status: DocumentReviewStatus;
}

export interface ICreateDocumentReviewDto {
  documentId: number;
  remark?: string;
  status?: DocumentReviewStatus;
}

export interface IGetDocumentReviewPayload {
  fileableId: number;
  fileableType: DocumentType;
}

export interface DocumentReviewableService {
  findOne(id: number): Promise<any>;
  getDocumentType(type?: string): DocumentType;
  documentFileType: DocumentType;
  resolveDocumentType?(args: {
    entity: any;
    body?: Record<string, any>;
    request?: Request;
  }): Promise<DocumentType> | DocumentType;
}
