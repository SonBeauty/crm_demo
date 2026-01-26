import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly producer: Producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
    console.log('✅ Kafka Producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async emitEvent(topic: string, eventKey: string, payload: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          key: eventKey,
          value: JSON.stringify(payload),
        },
      ],
    });
    console.log(`🚀 Sent event [${eventKey}] to topic [${topic}]`);
  }
}
