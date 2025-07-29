import winston from 'winston';
import { config } from '@/config/env';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? `\n${stack}` : ''}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: config.logging.fileMaxSize,
      maxFiles: config.logging.fileMaxFiles,
    }),

    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: config.logging.fileMaxSize,
      maxFiles: config.logging.fileMaxFiles,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// Add debug transport in development
if (config.server.isDevelopment) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/debug.log',
      level: 'debug',
    })
  );
}

export default logger;
