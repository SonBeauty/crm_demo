import { IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
