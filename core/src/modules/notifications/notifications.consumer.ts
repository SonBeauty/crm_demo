import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { KAFKA_TOPICS } from '../../common/constants';
import { KafkaMockService } from '../producer/kafka-mock.service';

@Injectable()
export class NotificationsConsumer implements OnModuleInit {
  private readonly logger = new Logger(NotificationsConsumer.name);

  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly kafkaMock: KafkaMockService,
  ) {}

  async onModuleInit() {
    const topics = [KAFKA_TOPICS.NOTIFICATION_EVENTS, KAFKA_TOPICS.USER_EVENTS];
    
    topics.forEach(topic => {
      this.kafkaMock.on(topic, async ({ topic, message }) => {
        try {
          const key = message.key?.toString();
          const value = message.value?.toString();
          
          if (key && value) {
            const payload = JSON.parse(value);
            this.logger.debug(`Received mock event [${key}] from topic [${topic}]`);
            await this.handleEvent(key, payload);
          }
        } catch (error) {
          this.logger.error('Error processing mock message', error);
        }
      });
    });

    this.logger.log(`Mock Consumer subscribed to: ${topics.join(', ')}`);
  }

  private async handleEvent(event: string, payload: any) {
    switch (event) {
      case 'NEW_USER':
        await this.handleNewUser(payload);
        break;
      case 'USER_UPDATED':
        await this.handleUserUpdated(payload);
        break;
      case 'USER_DELETED':
        await this.handleUserDeleted(payload);
        break;
      default:
        this.notificationsGateway.broadcast(event, payload);
    }
  }

  private async handleNewUser(payload: any) {
    this.notificationsGateway.broadcast('NEW_USER', {
      message: `New user joined: ${payload.name || payload.email}`,
      ...payload,
    });
  }

  private async handleUserUpdated(payload: any) {
    if (payload.userId) {
      this.notificationsGateway.sendToUser(payload.userId, 'USER_UPDATED', {
        message: 'Your profile has been updated',
        ...payload,
      });
    }
    
    this.notificationsGateway.broadcast('USER_UPDATED', payload);
  }

  private async handleUserDeleted(payload: any) {
    this.notificationsGateway.broadcast('USER_DELETED', {
      message: `User deleted: ${payload.userId}`,
      ...payload,
    });
  }
}
