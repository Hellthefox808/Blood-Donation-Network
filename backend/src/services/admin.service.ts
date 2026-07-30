import { prisma } from '../config/db';
import { AuditService } from './audit.service';

export class AdminService {
  static async getPendingHospitals() {
    return prisma.hospital.findMany({
      where: { isApproved: false },
      include: { user: { select: { email: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async verifyHospital(hospitalId: string, isApproved: boolean, adminUserId: string, ipAddress?: string) {
    const hospital = await prisma.hospital.update({
      where: { id: hospitalId },
      data: { isApproved },
    });

    await prisma.user.update({
      where: { id: hospital.userId },
      data: { isVerified: isApproved },
    });

    await AuditService.log({
      userId: adminUserId,
      action: isApproved ? 'HOSPITAL_VERIFIED_APPROVED' : 'HOSPITAL_VERIFIED_REJECTED',
      entity: 'Hospital',
      entityId: hospitalId,
      details: { isApproved, hospitalName: hospital.name },
      ipAddress,
    });

    return hospital;
  }

  static async getAuditLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, role: true } } },
      }),
      prisma.auditLog.count(),
    ]);

    return { logs, meta: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) } };
  }
}
