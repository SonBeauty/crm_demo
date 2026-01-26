import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto';
import { BCRYPT_SALT_ROUNDS } from '../../common/constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_SALT_ROUNDS,
    );

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);
    this.logger.log(`User created: ${savedUser.email}`);

    return savedUser;
  }

  async createFromAuth(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const newUser = this.usersRepository.create(data);
    const savedUser = await this.usersRepository.save(newUser);
    this.logger.log(`User registered via auth: ${savedUser.email}`);
    return savedUser;
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<User>> {
    const { page = 1, limit = 10, role } = paginationQuery;
    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    const [items, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .select(['user.id', 'user.email', 'user.name', 'user.role', 'user.createdAt', 'user.updatedAt'])
      .getManyAndCount();

    return new PaginatedResponseDto(items, total, page, limit);
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByIdOrFail(id: string): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneByIdOrFail(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        BCRYPT_SALT_ROUNDS,
      );
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    this.logger.log(`User updated: ${updatedUser.email}`);

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneByIdOrFail(id);
    await this.usersRepository.remove(user);
    this.logger.log(`User deleted: ${user.email}`);
  }

  async findAllManagers(): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'MANAGER' })
      .orderBy('user.createdAt', 'DESC')
      .select(['user.id', 'user.name', 'user.email'])
      .getMany();
  }
}
