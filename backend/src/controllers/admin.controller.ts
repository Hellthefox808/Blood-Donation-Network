import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { AdminService } from '../services/admin.service';

export const verifyHospitalSchema = z.object({
  isApproved: z.boolean(),
});

export class AdminController {
  static async getPendingHospitals(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hospitals = await AdminService.getPendingHospitals();
      res.status(200).json({ success: true, data: hospitals });
    } catch (error) {
      next(error);
    }
  }

  static async verifyHospital(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hospitalId = req.params.id;
      const { isApproved } = req.body;
      const hospital = await AdminService.verifyHospital(
        hospitalId,
        isApproved,
        req.user!.userId,
        req.ip
      );
      res.status(200).json({ success: true, data: hospital });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const logs = await AdminService.getAuditLogs(page, limit);
      res.status(200).json({ success: true, ...logs });
    } catch (error) {
      next(error);
    }
  }
}
