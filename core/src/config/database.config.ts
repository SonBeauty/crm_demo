import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'crm_db',
  synchronize: process.env.NODE_ENV !== 'production',
  autoLoadEntities: true,
  logging: process.env.NODE_ENV === 'development',
}));
