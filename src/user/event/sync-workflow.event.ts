export class SyncWorkflowEvent {
  constructor(
    public readonly payload: {
      firstName: string;
      lastName: string;
      wfUserId?: string;
      wfUserPassword?: string;
      email: string;
      id: number;
    },
  ) {}
}
