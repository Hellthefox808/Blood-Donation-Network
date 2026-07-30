import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

export const registerDonorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  phone: z.string().min(7),
  bloodGroup: z.enum([
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
  ]),
  dateOfBirth: z.string(),
  weightKg: z.number().min(50, 'Donor weight must be at least 50 kg'),
  latitude: z.number(),
  longitude: z.number(),
});

export const registerHospitalSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
  licenseNumber: z.string().min(3),
  phone: z.string().min(7),
  address: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class AuthController {
  static async registerDonor(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerDonor({
        ...req.body,
        ipAddress: req.ip,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async registerHospital(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerHospital({
        ...req.body,
        ipAddress: req.ip,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
