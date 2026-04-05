export interface staffBackground {
  accountId: number;
  filePath: string;
  fileId: string;
}

export interface StaffQueue {
  template: string;
  keys: string[];
  accountId: number;
  uploadRef: string;
}

/**
 * @todo move to document interface
 */
export interface IDocumentFile {
  name: string;
  filePath: string;
  awsKey: string;
  mimeType: string;
  size: number;
}

export interface BulkUploadPayload {
  option: string;
  entry: string;
  template: string;
  documentFiles: IDocumentFile[];
}
