import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { UsersService } from '../users/user.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createDto: CreateTaskDto,
    owner: { id: string; role: any },
  ): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createDto,
      ownerId: owner.id,
      ownerRole: owner.role,
      status: TaskStatus.TODO,
    });

    if (createDto.assignedToId) {
      const user = await this.usersService.findOneById(createDto.assignedToId);
      if (!user) {
        throw new NotFoundException('Assigned user not found');
      }
    }

    const saved = await this.tasksRepository.save(task);
    this.logger.log(`Task created: ${saved.id}`);
    return saved;
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['owner', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['owner', 'assignedTo'],
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    if (dto.assignedToId) {
      const user = await this.usersService.findOneById(dto.assignedToId);
      if (!user) {
        throw new NotFoundException('Assigned user not found');
      }
    }

    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);
    task.status = status;
    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
