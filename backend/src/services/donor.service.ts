import { prisma } from '../config/db';
import { AuditService } from './audit.service';

export class DonorService {
  static async getProfile(userId: string) {
    const profile = await prisma.donorProfile.findUnique({
      where: { userId },
      include: {
        matches: {
          include: {
            request: {
              include: { hospital: true },
            },
          },
          orderBy: { notifiedAt: 'desc' },
        },
      },
    });

    if (!profile) {
      throw { status: 404, message: 'Donor profile not found.' };
    }

    return profile;
  }

  static async updateAvailability(userId: string, isAvailable: boolean, ipAddress?: string) {
    const profile = await prisma.donorProfile.update({
      where: { userId },
      data: { isAvailable },
    });

    await AuditService.log({
      userId,
      action: 'DONOR_AVAILABILITY_TOGGLED',
      entity: 'DonorProfile',
      entityId: profile.id,
      details: { isAvailable },
      ipAddress,
    });

    return profile;
  }

  static async updateLocation(
    userId: string,
    latitude: number,
    longitude: number,
    ipAddress?: string
  ) {
    const profile = await prisma.donorProfile.update({
      where: { userId },
      data: { latitude, longitude },
    });

    await AuditService.log({
      userId,
      action: 'DONOR_LOCATION_UPDATED',
      entity: 'DonorProfile',
      entityId: profile.id,
      details: { latitude, longitude },
      ipAddress,
    });

    return profile;
  }
}
