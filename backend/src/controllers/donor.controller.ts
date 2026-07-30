import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { DonorService } from '../services/donor.service';

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const updateLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export class DonorController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await DonorService.getProfile(req.user!.userId);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await DonorService.updateAvailability(
        req.user!.userId,
        req.body.isAvailable,
        req.ip
      );
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async updateLocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await DonorService.updateLocation(
        req.user!.userId,
        req.body.latitude,
        req.body.longitude,
        req.ip
      );
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }
}
