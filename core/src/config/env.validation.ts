import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(4000),
  API_PREFIX: Joi.string().default('api/v1'),

  // Database
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(3306),
  DB_USER: Joi.string().default('root'),
  DB_PASS: Joi.string().allow('').default(''),
  DB_NAME: Joi.string().default('crm_db'),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // Kafka
  KAFKA_BROKERS: Joi.string().allow('').default('localhost:9092'),
  KAFKA_CLIENT_ID: Joi.string().default('crm-core'),
});
