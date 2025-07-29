import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || 'localhost',
    isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
    isProduction: (process.env.NODE_ENV || 'development') === 'production',
    isTest: (process.env.NODE_ENV || 'development') === 'test',
  },
  database: {
    url: process.env.DATABASE_URL || 'sqlite://./dev.db',
  },
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      'your-super-secret-jwt-key-change-this-in-production-minimum-32-characters',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      'your-super-secret-refresh-jwt-key-change-this-in-production-minimum-32-characters',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000')
      .split(',')
      .map(origin => origin.trim()),
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    fileMaxSize: Number(process.env.LOG_FILE_MAX_SIZE) || 5242880,
    fileMaxFiles: Number(process.env.LOG_FILE_MAX_FILES) || 10,
  },
  security: {
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
    sessionSecret:
      process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this-in-production',
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
  },
};
