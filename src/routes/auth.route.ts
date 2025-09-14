import express from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { authenticateToken } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import { authSchemas } from '@/common/schemas/auth.schema';

const router: express.Router = express.Router();

router.post('/register', validateBody(authSchemas.register), AuthController.register);

router.post('/login', validateBody(authSchemas.login), AuthController.login);

router.get('/profile', authenticateToken, AuthController.getProfile);

router.post('/logout', authenticateToken, AuthController.logout);

export default router;
