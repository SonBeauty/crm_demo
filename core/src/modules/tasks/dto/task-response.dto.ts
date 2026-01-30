import { Task } from '../entities/task.entity';

export class TaskResponseDto {
  id: string;
  title: string;
  description?: string;
  status: Task['status'];
  ownerId?: string;
  ownerRole?: Task['ownerRole'];
  assignedToId?: string;
  createdAt: Date;
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
