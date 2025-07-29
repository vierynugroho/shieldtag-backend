import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { validationErrorResponse } from '@/utils/response';
import logger from '@/utils/logger';

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Validation failed', {
          path: req.path,
          method: req.method,
          errors,
          body: req.body,
        });

        return validationErrorResponse(res, errors, 'Validation failed');
      }

      logger.error('Unexpected validation error', {
        path: req.path,
        method: req.method,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return res.status(500).json({
        meta: {
          success: false,
          message: 'Internal server error during validation',
          code: 500,
          timestamp: new Date().toISOString(),
        },
        data: null,
      });
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Query validation failed', {
          path: req.path,
          method: req.method,
          errors,
          query: req.query,
        });

        return validationErrorResponse(res, errors, 'Query validation failed');
      }

      return res.status(500).json({
        meta: {
          success: false,
          message: 'Internal server error during query validation',
          code: 500,
          timestamp: new Date().toISOString(),
        },
        data: null,
      });
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Params validation failed', {
          path: req.path,
          method: req.method,
          errors,
          params: req.params,
        });

        return validationErrorResponse(res, errors, 'Parameters validation failed');
      }

      return res.status(500).json({
        meta: {
          success: false,
          message: 'Internal server error during params validation',
          code: 500,
          timestamp: new Date().toISOString(),
        },
        data: null,
      });
    }
  };
};
