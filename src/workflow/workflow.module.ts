import { Global, Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { HttpModule } from '@nestjs/axios';
import { WorkflowPasswordProvider } from '@app/workflow/providers';

@Global()
@Module({
  controllers: [WorkflowController],
  providers: [WorkflowService, WorkflowPasswordProvider],
  imports: [
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 1,
    }),
  ],
  exports: [WorkflowService],
})
export class WorkflowModule {}
