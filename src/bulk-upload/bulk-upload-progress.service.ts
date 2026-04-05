import { Injectable } from '@nestjs/common';
import { BUlkUploadProgress } from './interface';
import { SocketService } from '@app/socket/socket.service';

@Injectable()
export class BulkUploadProgressService extends SocketService<BUlkUploadProgress> {
  sendProgressUpdate(data: BUlkUploadProgress) {
    this.sendToAccount(data.uploadRef, data);
  }
}
