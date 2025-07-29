import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { config } from './config/env';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import appRoutes from '@/routes';
import logger from '@/utils/logger';
import { errorResponse, successResponse } from '@/utils/response';

const app: express.Express = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(compression());

// Konfigurasi CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-auth-token'],
  })
);

// Middleware parsing body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware logging
if (config.server.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    meta: {
      success: false,
      message: 'Too many requests from this IP, please try again later',
      code: 429,
      timestamp: new Date().toISOString(),
    },
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Endpoint health check
app.get('/health', (req, res) => {
  successResponse(
    res,
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.server.env,
      version: config.api.version,
    },
    'Service is healthy'
  );
});

// Endpoint welcome
app.get('/', (req, res) => {
  successResponse(
    res,
    {
      message: 'Welcome to ShieldTag API',
      version: config.api.version,
      documentation: '/docs',
    },
    'API is running successfully'
  );
});

// Routing utama
app.use(`${config.api.prefix}/${config.api.version}`, appRoutes);

// Handler 404
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

// Handler error global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = config.server.isProduction ? 'Internal server error' : err.message;

  errorResponse(res, message, statusCode);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Mulai server
const server = app.listen(config.server.port, config.server.host, () => {
  logger.info(`🚀 Server berjalan di http://${config.server.host}:${config.server.port}`, {
    environment: config.server.env,
    version: config.api.version,
  });
});

export { server };
export default app;
