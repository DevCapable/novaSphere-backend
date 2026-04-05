export interface BaseServiceInterface<T> {
  findAll();
  find(id: number): Promise<T>;
  update(id: number, entity: T): Promise<T>;
  create(entity: T);
  delete(id: number);
}

export interface IBase {
  id: number;
  uuid?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBaseRecord extends IBase {
  name: string;
  type: string;
  metaData?: any;
  parentId?: number;
  parent: IBaseRecord;
  slug?: string;
  isActive?: number;
}

export interface IBaseApplication extends IBase {
  appNumber?: string;
  wfCaseId?: string;
  parentId?: number;
  dateSubmitted?: Date;
  dateApproved?: Date;
  certificateNumber?: string;
  accountId: number;
}
