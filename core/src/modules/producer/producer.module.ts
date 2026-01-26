import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
