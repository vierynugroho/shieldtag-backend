import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader, JwtPayload } from '@/utils/jwt';
import { unauthorizedResponse } from '@/utils/response';
import logger from '@/utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      logger.warn('No token provided in request', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent'),
      });
      return unauthorizedResponse(res, 'Access token is required');
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Add user data to request
    req.user = decoded;

    logger.info('User authenticated successfully', {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error('Token verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent'),
    });

    return unauthorizedResponse(res, 'Invalid or expired token');
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Authorization attempted without authentication', {
        ip: req.ip,
        path: req.path,
      });
      return unauthorizedResponse(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: roles,
        path: req.path,
      });
      return unauthorizedResponse(res, 'Insufficient permissions');
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermissions = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return unauthorizedResponse(res, 'Authentication required');
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.every(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      logger.warn('Insufficient permissions', {
        userId: req.user.userId,
        userPermissions,
        requiredPermissions: permissions,
        path: req.path,
      });
      return unauthorizedResponse(res, 'Insufficient permissions');
    }

    next();
  };
};
