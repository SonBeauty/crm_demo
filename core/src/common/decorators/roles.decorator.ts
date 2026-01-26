import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/entities/user.entity';
import { ROLES_KEY } from '../constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

