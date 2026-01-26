// Metadata keys
export const ROLES_KEY = 'roles';

// Kafka Topics
export const KAFKA_TOPICS = {
  NOTIFICATION_EVENTS: 'notification_events',
  USER_EVENTS: 'user_events',
} as const;

// Event Keys
export const EVENT_KEYS = {
  NEW_USER: 'NEW_USER',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
} as const;

// API
export const API_PREFIX = 'api/v1';
export const SWAGGER_PATH = 'api/docs';

// Bcrypt
export const BCRYPT_SALT_ROUNDS = 10;
