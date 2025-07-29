import express from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { authenticateToken } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import { z } from 'zod';

const router: express.Router = express.Router();

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'user']).refine(val => !!val, {
    message: 'Role is required',
    path: ['role'],
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/register', validateBody(registerSchema), AuthController.register);

router.post('/login', validateBody(loginSchema), AuthController.login);

router.get('/profile', authenticateToken, AuthController.getProfile);

router.post('/logout', authenticateToken, AuthController.logout);

router.post('/refresh-token', AuthController.refreshToken);

export default router;
