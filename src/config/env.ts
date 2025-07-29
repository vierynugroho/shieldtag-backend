import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define environment schema
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  HOST: z.string().default('localhost'),

  // Database Configuration
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // JWT Configuration
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS Configuration
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_MAX_SIZE: z.string().transform(Number).default('5242880'),
  LOG_FILE_MAX_FILES: z.string().transform(Number).default('10'),

  // Security
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default('12'),
  SESSION_SECRET: z.string().min(1, 'SESSION_SECRET is required'),

  // API Configuration
  API_VERSION: z.string().default('v1'),
  API_PREFIX: z.string().default('/api'),
});

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

// Export validated environment variables
export const env = validateEnv();

// Export configuration object
export const config = {
  server: {
    env: env.NODE_ENV,
    port: env.PORT,
    host: env.HOST,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  },
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  cors: {
    origin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
  },
  logging: {
    level: env.LOG_LEVEL,
    fileMaxSize: env.LOG_FILE_MAX_SIZE,
    fileMaxFiles: env.LOG_FILE_MAX_FILES,
  },
  security: {
    bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
    sessionSecret: env.SESSION_SECRET,
  },
  api: {
    version: env.API_VERSION,
    prefix: env.API_PREFIX,
  },
};
