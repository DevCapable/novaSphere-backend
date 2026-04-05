import { AccountModule } from '@app/account/account.module';
import { Module, forwardRef } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatRepository } from './stat.repository';
import { DocumentModule } from '@app/document/document.module';
import { StaffModule } from '@app/staff/staff.module';

@Module({
  imports: [forwardRef(() => AccountModule), DocumentModule, StaffModule],
  providers: [StatService, StatRepository],
  exports: [StatService, StatRepository],
})
export class StatModule {}
