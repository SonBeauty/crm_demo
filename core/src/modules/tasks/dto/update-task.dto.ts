import { IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @IsOptional()
  @ApiPropertyOptional({ example: 'Update task title' })
  @IsString()
  title?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: 'New description for task' })
  @IsString()
  description?: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  status?: TaskStatus;

  @IsOptional()
  @ApiPropertyOptional({ example: 'a3f8c5d2-9b9e-4a6d-8f3b-1234567890ab' })
  @IsUUID()
  assignedToId?: string;
}
