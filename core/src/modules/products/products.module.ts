import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './product.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProducerModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
