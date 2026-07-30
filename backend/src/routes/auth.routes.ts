import { Router } from 'express';
import { AuthController, registerDonorSchema, registerHospitalSchema, loginSchema } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.post('/register/donor', validate(registerDonorSchema), AuthController.registerDonor);
router.post('/register/hospital', validate(registerHospitalSchema), AuthController.registerHospital);
router.post('/login', validate(loginSchema), AuthController.login);

export default router;
