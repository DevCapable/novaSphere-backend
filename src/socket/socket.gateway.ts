import { BulkUploadProgressService } from '@app/bulk-upload/bulk-upload-progress.service';
import { NotificationService } from '@app/notification/notification.service';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppSocketGateway implements OnGatewayConnection {
  constructor(
    private bulkUploadProgressService: BulkUploadProgressService,
    private notificationService: NotificationService,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const accountId = client.handshake.query.accountId as string;

    if (!accountId) return client.disconnect();
    client.join(`account-${accountId}`);
  }

  afterInit() {
    this.bulkUploadProgressService.setServer(this.server);
    this.notificationService.setServer(this.server);
  }
}
