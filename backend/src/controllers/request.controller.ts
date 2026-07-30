import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { RequestService } from '../services/request.service';

export const createRequestSchema = z.object({
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
  componentType: z.enum([
    'WHOLE_BLOOD',
    'PACKED_RED_BLOOD_CELLS',
    'PLATELETS',
    'FRESH_FROZEN_PLASMA',
    'CRYOPRECIPITATE',
  ]),
  unitsRequested: z.number().int().min(1).max(20),
  urgency: z.enum(['ROUTINE', 'URGENT', 'CRITICAL']),
  requiredBy: z.string(),
  notes: z.string().optional(),
});

export const confirmFulfillmentSchema = z.object({
  requestId: z.string().uuid(),
  donorId: z.string().uuid(),
});

export class RequestController {
  static async createRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RequestService.createRequest({
        ...req.body,
        userId: req.user!.userId,
        ipAddress: req.ip,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getHospitalRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const requests = await RequestService.getHospitalRequests(req.user!.userId);
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  static async acceptMatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const matchId = req.params.id;
      const match = await RequestService.acceptMatch(matchId, req.user!.userId, req.ip);
      res.status(200).json({ success: true, data: match });
    } catch (error) {
      next(error);
    }
  }

  static async confirmFulfillment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { requestId, donorId } = req.body;
      const result = await RequestService.confirmFulfillment(
        requestId,
        donorId,
        req.user!.userId,
        req.ip
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
