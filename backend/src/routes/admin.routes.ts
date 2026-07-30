import { Router } from 'express';
import { AdminController, verifyHospitalSchema } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole(['SYSTEM_ADMIN']));

router.get('/hospitals/pending', AdminController.getPendingHospitals);
router.post('/hospitals/:id/verify', validate(verifyHospitalSchema), AdminController.verifyHospital);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
