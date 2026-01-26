import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { ProducerService } from '../producer/producer.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guar';
import { RolesGuard } from '../../common/guards/roles.guard';
const { UserRole } = require('./entities/user.entity');

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly producerService: ProducerService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);

    this.producerService.emitEvent('notification_events', 'NEW_USER', {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    return { message: 'User created successfully', data: newUser };
  }
}
