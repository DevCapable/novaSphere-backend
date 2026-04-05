import { UploadModuleName, UploadStatus } from '../enum';

export interface BUlkUploadProgress {
  accountId: number;
  uploadRef: string;
  moduleName: UploadModuleName;
  status: UploadStatus;
  currentFile?: number;
  totalFiles?: number;
  totalRows?: number;
  currentRow?: number;
  msg?: string;
}
