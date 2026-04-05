// cluster-io.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/cluster-adapter';
import { setupWorker } from '@socket.io/sticky';

export class ClusterIoAdapter extends IoAdapter {
  constructor(app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    // Create the Socket.IO server using the parent class method
    const server = super.createIOServer(port, options);

    // Configure the cluster adapter to allow broadcasting across workers
    server.adapter(createAdapter());

    // Set up sticky sessions to ensure that a client’s connection
    // always goes to the same worker process.
    setupWorker(server);

    return server;
  }
}
