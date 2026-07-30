import { prisma } from '../config/db';

export class AuditService {
  static async log(params: {
    userId?: string;
    action: string;
    entity: string;
    entityId: string;
    details: object;
    ipAddress?: string;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          details: JSON.stringify(params.details),
          ipAddress: params.ipAddress || '127.0.0.1',
        },
      });
    } catch (error) {
      console.error('[Audit Log Error]: Failed to write audit entry:', error);
    }
  }
}
