import express from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { authenticateToken } from '@/middleware/auth';

const router: express.Router = express.Router();

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/profile', authenticateToken, AuthController.getProfile);

router.post('/logout', authenticateToken, AuthController.logout);

router.post('/refresh-token', AuthController.refreshToken);

export default router;
