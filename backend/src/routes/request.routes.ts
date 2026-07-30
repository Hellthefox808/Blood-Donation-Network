import { Router } from 'express';
import { RequestController, createRequestSchema, confirmFulfillmentSchema } from '../controllers/request.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

// Hospital creation & status endpoints
router.post('/hospitals/requests', requireRole(['HOSPITAL_ADMIN']), validate(createRequestSchema), RequestController.createRequest);
router.get('/hospitals/requests', requireRole(['HOSPITAL_ADMIN']), RequestController.getHospitalRequests);
router.post('/hospitals/donations/confirm', requireRole(['HOSPITAL_ADMIN']), validate(confirmFulfillmentSchema), RequestController.confirmFulfillment);

// Donor match acceptance
router.post('/matches/:id/accept', requireRole(['DONOR']), RequestController.acceptMatch);

export default router;
