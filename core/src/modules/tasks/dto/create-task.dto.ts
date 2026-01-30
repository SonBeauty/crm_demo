import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Prepare onboarding docs' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Collect papers and setup accounts for new hires',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'a3f8c5d2-9b9e-4a6d-8f3b-1234567890ab' })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
