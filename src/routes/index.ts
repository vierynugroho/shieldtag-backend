import express from 'express';
import authRoutes from './auth.route';

const router: express.Router = express.Router();

router.use('/auth', authRoutes);

export default router;
