import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TasksService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  @ApiResponse({
    status: 201,
    description: 'Task created',
    type: TaskResponseDto,
  })
  async create(@Body() dto: CreateTaskDto, @Request() req: any) {
    const task = await this.tasksService.create(dto, {
      id: req.user.id,
      role: req.user.role,
    });
    return new TaskResponseDto(task);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  async findAll() {
    const tasks = await this.tasksService.findAll();
    return tasks.map((t) => new TaskResponseDto(t));
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({
    status: 200,
    description: 'Task found',
    type: TaskResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const task = await this.tasksService.findOne(id);
    return new TaskResponseDto(task);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({
    status: 200,
    description: 'Task updated',
    type: TaskResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.update(id, dto);
    return new TaskResponseDto(task);
  }

  @Patch(':id/status')
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({
    status: 200,
    description: 'Task status updated',
    type: TaskResponseDto,
  })
  @ApiBody({ type: UpdateTaskStatusDto })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTaskStatusDto,
  ) {
    const task = await this.tasksService.updateStatus(id, body.status);
    return new TaskResponseDto(task);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiOperation({ summary: 'Delete task' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tasksService.remove(id);
    return { message: 'Task deleted' };
  }
}
