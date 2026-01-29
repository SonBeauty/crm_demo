import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto';
import { ProducerService } from '../producer/producer.service';
import { KAFKA_TOPICS, EVENT_KEYS } from '../../common/constants';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly producerService: ProducerService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productsRepository.create(createProductDto);
    const savedProduct = await this.productsRepository.save(newProduct);
    
    this.logger.log(`Product created: ${savedProduct.name} (${savedProduct.id})`);

    // Emit event to Kafka
    this.producerService.emitEvent(
      KAFKA_TOPICS.PRODUCT_EVENTS,
      EVENT_KEYS.PRODUCT_CREATED,
      {
        id: savedProduct.id,
        name: savedProduct.name,
        price: savedProduct.price,
        stock: savedProduct.stock,
      },
    );

    return savedProduct;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Product>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [items, total] = await this.productsRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return new PaginatedResponseDto(items, total, page, limit);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productsRepository.save(product);
    
    this.logger.log(`Product updated: ${updatedProduct.name} (${updatedProduct.id})`);

    // Emit event to Kafka
    this.producerService.emitEvent(
      KAFKA_TOPICS.PRODUCT_EVENTS,
      EVENT_KEYS.PRODUCT_UPDATED,
      {
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        stock: updatedProduct.stock,
      },
    );

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    
    this.logger.log(`Product deleted: ${product.name} (${id})`);

    // Emit event to Kafka
    this.producerService.emitEvent(
      KAFKA_TOPICS.PRODUCT_EVENTS,
      EVENT_KEYS.PRODUCT_DELETED,
      { id },
    );
  }
}
