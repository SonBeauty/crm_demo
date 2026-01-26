import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/entities/user.entity'; // Import Enum Role của bạn

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
