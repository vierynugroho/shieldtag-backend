import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { LoginInput, RegisterInput } from '@/types/user';
import { successResponse, errorResponse, createdResponse } from '@/utils/response';
import logger from '@/utils/logger';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const userData: RegisterInput = req.body;

      const result = await AuthService.register(userData);

      return createdResponse(res, result, 'User registered successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';

      if (message.includes('already exists')) {
        return errorResponse(res, message, 409);
      }

      return errorResponse(res, message, 400);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const credentials: LoginInput = req.body;

      const result = await AuthService.login(credentials);

      return successResponse(res, result, 'Login successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';

      if (message.includes('Invalid email or password')) {
        return errorResponse(res, message, 401);
      }

      return errorResponse(res, message, 400);
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      const user = await AuthService.getUserProfile(userId);

      return successResponse(res, user, 'User profile retrieved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user profile';

      if (message.includes('not found')) {
        return errorResponse(res, message, 404);
      }

      return errorResponse(res, message, 500);
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (userId) {
        logger.info('User logged out', { userId });
      }

      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      return errorResponse(res, message, 500);
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      return errorResponse(res, 'Refresh token endpoint not implemented yet', 501);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      return errorResponse(res, message, 500);
    }
  }
}
