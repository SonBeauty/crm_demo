import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict this to your frontend URL
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake auth or query
      const token =
        client.handshake.auth.token || client.handshake.query.token;

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        // Optional: client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token);
      
      // Store user info in socket data
      client.data.user = payload;
      
      // Join a room based on user ID for private notifications
      client.join(`user:${payload.sub}`);
      
      this.logger.log(`Client connected: ${client.id} (User: ${payload.email})`);
    } catch (error) {
      this.logger.error(`Connection authentication failed for ${client.id}`, error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Broadcast an event to all connected clients
   */
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  /**
   * Send an event to a specific user
   */
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
