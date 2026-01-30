import { Task, TaskStatus } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 'a3f8c5d2-9b9e-4a6d-8f3b-1234567890ab' })
  id: string;

  @ApiProperty({ example: 'Prepare onboarding docs' })
  title: string;

  @ApiProperty({
    example: 'Collect papers and setup accounts for new hires',
    required: false,
  })
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  status: Task['status'];

  @ApiProperty({
    example: 'd4b9c0e1-1111-2222-3333-444455556666',
    required: false,
  })
  ownerId?: string;

  @ApiProperty({ example: TaskStatus.TODO, required: false })
  ownerRole?: Task['ownerRole'];

  @ApiProperty({
    example: 'a3f8c5d2-9b9e-4a6d-8f3b-1234567890ab',
    required: false,
  })
  assignedToId?: string;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.status = task.status;
    this.ownerId = task.ownerId;
    this.ownerRole = task.ownerRole;
    this.assignedToId = task.assignedToId;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
  }
}
