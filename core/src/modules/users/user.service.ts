import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // CÁCH 1: Dùng hàm ORM cơ bản (Cho CRUD đơn giản)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Tạo object instance (chưa lưu DB)
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Lưu xuống DB (Insert)
    return await this.usersRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // CÁCH 2: Query Builder (Giống viết SQL nhưng an toàn hơn)
  // Ví dụ: Lấy danh sách Manager và sắp xếp theo ngày tạo
  async findAllManagers() {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'MANAGER' })
      .orderBy('user.createdAt', 'DESC')
      .select(['user.id', 'user.name', 'user.email']) // Chỉ select cột cần thiết
      .getMany();
  }

  // CÁCH 3: Raw SQL (Nếu bạn thích Hardcore)
  async rawQueryExample() {
    return await this.usersRepository.query(
      'SELECT * FROM users WHERE role = ?',
      ['ADMIN'],
    );
  }
}
