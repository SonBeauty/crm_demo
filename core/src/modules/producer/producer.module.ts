import { Module, Global } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { KafkaMockService } from './kafka-mock.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ProducerService, KafkaMockService],
  exports: [ProducerService, KafkaMockService],
})
export class ProducerModule {}
