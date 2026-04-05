export interface BatchReassignCasePayload {
  caseId: string;
  delIndex: number;
}

export interface BatchReassignPayload {
  caseIds: string[];
  assigneeId: number;
  ownerId: number;
  groupId: string;
}
