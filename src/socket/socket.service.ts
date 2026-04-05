import { Server } from 'socket.io';

interface SocketDataInterface {
  accountId: number;
  [key: string]: any;
}

export class SocketService<D extends SocketDataInterface> {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  protected sendToAccount(message: string, data: D) {
    const { accountId, ...socketData } = data;

    this.server.to(`account-${accountId}`).emit(message, socketData);
  }

  protected send(message: string, data: Omit<D, 'accountId'>) {
    this.server.emit(message, data);
  }
}
