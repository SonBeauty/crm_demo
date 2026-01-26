import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsConsumer } from './notifications.consumer';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [NotificationsGateway, NotificationsConsumer],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
