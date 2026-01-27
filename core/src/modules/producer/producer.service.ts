import { Injectable, Logger } from '@nestjs/common';
import { KafkaMockService } from './kafka-mock.service';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(private readonly kafkaMock: KafkaMockService) {}

  async emitEvent(topic: string, eventKey: string, payload: any): Promise<void> {
    try {
      this.kafkaMock.emit(topic, eventKey, payload);
      this.logger.debug(`Event [${eventKey}] sent to mock topic [${topic}]`);
    } catch (error) {
      this.logger.error(`Failed to send event [${eventKey}] to mock topic [${topic}]`, error);
      throw error;
    }
  }
}
