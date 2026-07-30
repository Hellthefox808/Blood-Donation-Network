import { Router } from 'express';
import authRoutes from './auth.routes';
import donorRoutes from './donor.routes';
import requestRoutes from './request.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/donors', donorRoutes);
router.use('/', requestRoutes);
router.use('/admin', adminRoutes);

export default router;
