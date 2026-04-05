import { S3Service } from '@app/document/s3.service';
import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FilesInterceptor } from '@nestjs/platform-express';

interface DocumentsInterceptorOptions {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

export function AWSDocumentInterceptor(
  options: DocumentsInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(private readonly s3Service: S3Service) {
      const multerOptions: MulterOptions = {
        storage: memoryStorage(),
        fileFilter: options.fileFilter,
        limits: options.limits,
      };

      this.fileInterceptor = new (FilesInterceptor(
        options.fieldName,
        20,
        multerOptions,
      ))();
    }

    async intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}
