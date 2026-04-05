import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SyncWorkflowEvent } from '@app/user/event';
import { Events } from '@app/user/constants';
import { WorkflowService } from '@app/workflow/workflow.service';
import { LoggerService } from '@app/logger';

@Injectable()
export class SyncWorkflowListener {
  constructor(
    private readonly workFlowService: WorkflowService,
    private readonly loggerService: LoggerService,
  ) {}

  @OnEvent(Events.SYNC_WORKFLOW_EVENT)
  async syncUserWithWorkflow(event: SyncWorkflowEvent) {
    const { email, wfUserPassword, id } = event.payload;

    try {
      await this.workFlowService.clearToken(email);
      await this.workFlowService.login(email, wfUserPassword);
      this.loggerService.log('synced with PM');
    } catch (error) {
      this.loggerService.log('not synced with PM');
      await this.workFlowService.syncUser(id);
      await this.workFlowService.login(email, wfUserPassword);
    }
  }
}
