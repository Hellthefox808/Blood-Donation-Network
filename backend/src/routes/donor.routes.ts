import { Router } from 'express';
import { DonorController, updateAvailabilitySchema, updateLocationSchema } from '../controllers/donor.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole(['DONOR']));

router.get('/me', DonorController.getProfile);
router.put('/availability', validate(updateAvailabilitySchema), DonorController.updateAvailability);
router.put('/location', validate(updateLocationSchema), DonorController.updateLocation);

export default router;
