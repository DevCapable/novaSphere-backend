import { UploadModuleName } from '../enum';

export interface BulkUploadCallback {
  (data: any): Promise<void>;
}

export interface BulkUploadQueueData {
  template: string;
  uploadRef: string;
  keys: string[];
  accountId: number;
  moduleKey: UploadModuleName;
  handler: string;
}
