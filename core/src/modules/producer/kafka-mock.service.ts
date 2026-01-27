import { Injectable, Logger, Global } from '@nestjs/common';
import { EventEmitter } from 'events';

@Global()
@Injectable()
export class KafkaMockService {
  private readonly emitter = new EventEmitter();
  private readonly logger = new Logger(KafkaMockService.name);

  constructor() {
    this.logger.log('Mock Kafka Service Initialized (Memory-based)');
  }

  emit(topic: string, key: string, payload: any) {
    this.logger.log(`[MOCK KAFKA PRODUCER] -> Topic: ${topic} | Key: ${key}`);
    
    setTimeout(() => {
      this.emitter.emit(topic, { 
        topic, 
        partition: 0, 
        message: {
          key: Buffer.from(key),
          value: Buffer.from(JSON.stringify(payload))
        }
      });
    }, 150);
  }

  on(topic: string, callback: (data: any) => void) {
    this.logger.log(`[MOCK KAFKA CONSUMER] <- Subscribed to: ${topic}`);
    this.emitter.on(topic, callback);
  }
}
