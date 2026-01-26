import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';
import { NotificationsGateway } from './notifications.gateway';
import { KAFKA_TOPICS } from '../../common/constants';

@Injectable()
export class NotificationsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsConsumer.name);
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {
    const brokers = this.configService
      .get<string>('KAFKA_BROKERS', 'localhost:9092')
      .split(',');

    this.kafka = new Kafka({
      clientId: 'crm-notifications-consumer',
      brokers,
    });

    this.consumer = this.kafka.consumer({ groupId: 'notifications-group' });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      
      // Subscribe to topics
      await this.consumer.subscribe({
        topic: KAFKA_TOPICS.NOTIFICATION_EVENTS,
        fromBeginning: true,
      });

      this.logger.log('Kafka Consumer connected and subscribed');

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const key = message.key?.toString();
            const value = message.value?.toString();
            
            if (key && value) {
              const payload = JSON.parse(value);
              this.logger.debug(`Received event [${key}] from topic [${topic}]`);
              
              // Broadcast the event to connected WebSocket clients
              // The event name in Socket.IO will be the Kafka message key
              this.notificationsGateway.broadcast(key, payload);
            }
          } catch (error) {
            this.logger.error('Error processing Kafka message', error);
          }
        },
      });
    } catch (error) {
      this.logger.error('Failed to connect Kafka Consumer', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
      this.logger.log('Kafka Consumer disconnected');
    } catch (error) {
      this.logger.error('Failed to disconnect Kafka Consumer', error);
    }
  }
}
