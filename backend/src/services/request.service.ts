import { prisma } from '../config/db';
import { getCompatibleDonorBloodGroups } from '../utils/blood-compatibility';
import { calculateHaversineDistanceMeters, calculateNextEligibleDate } from '../utils/eligibility-calculator';
import { AuditService } from './audit.service';
import { BloodGroup, ComponentType, RequestUrgency } from '../types';

export class RequestService {
  static async createRequest(input: {
    userId: string;
    bloodGroup: BloodGroup;
    componentType: ComponentType;
    unitsRequested: number;
    urgency: RequestUrgency;
    requiredBy: string;
    notes?: string;
    ipAddress?: string;
  }) {
    const hospital = await prisma.hospital.findUnique({ where: { userId: input.userId } });
    if (!hospital) {
      throw { status: 404, message: 'Hospital profile not found for this user.' };
    }

    if (!hospital.isApproved) {
      throw {
        status: 403,
        message: 'Your hospital account is pending System Admin accreditation verification.',
      };
    }

    const bloodRequest = await prisma.bloodRequest.create({
      data: {
        hospitalId: hospital.id,
        bloodGroup: input.bloodGroup,
        componentType: input.componentType || 'WHOLE_BLOOD',
        unitsRequested: input.unitsRequested,
        urgency: input.urgency || 'ROUTINE',
        status: 'SEARCHING',
        requiredBy: new Date(input.requiredBy),
        notes: input.notes,
      },
    });

    // Run spatial donor proximity matching
    const matchesCount = await this.matchAndNotifyDonors(bloodRequest.id, hospital.latitude, hospital.longitude);

    await AuditService.log({
      userId: input.userId,
      action: 'BLOOD_REQUEST_CREATED',
      entity: 'BloodRequest',
      entityId: bloodRequest.id,
      details: {
        bloodGroup: input.bloodGroup,
        unitsRequested: input.unitsRequested,
        urgency: input.urgency,
        matchedDonorsCount: matchesCount,
      },
      ipAddress: input.ipAddress,
    });

    return { bloodRequest, matchedDonorsCount: matchesCount };
  }

  static async matchAndNotifyDonors(requestId: string, hospitalLat: number, hospitalLng: number) {
    const request = await prisma.bloodRequest.findUnique({ where: { id: requestId } });
    if (!request) return 0;

    const compatibleBloodGroups = getCompatibleDonorBloodGroups(request.bloodGroup as BloodGroup);
    
    // Select maximum radius based on urgency
    const radiusMeters = request.urgency === 'CRITICAL' ? 50000 : request.urgency === 'URGENT' ? 25000 : 10000;
    const now = new Date();

    const candidateDonors = await prisma.donorProfile.findMany({
      where: {
        bloodGroup: { in: compatibleBloodGroups },
        isAvailable: true,
        nextEligibleDate: { lte: now },
      },
    });

    const matchesToCreate = candidateDonors
      .map((donor) => {
        const dist = calculateHaversineDistanceMeters(
          hospitalLat,
          hospitalLng,
          donor.latitude,
          donor.longitude
        );
        return { donor, distanceMeters: dist };
      })
      .filter((item) => item.distanceMeters <= radiusMeters)
      .slice(0, 20); // Limit to top 20 nearest candidate matches

    for (const item of matchesToCreate) {
      await prisma.match.upsert({
        where: {
          requestId_donorId: {
            requestId: request.id,
            donorId: item.donor.id,
          },
        },
        create: {
          requestId: request.id,
          donorId: item.donor.id,
          status: 'NOTIFIED',
          distanceMeters: item.distanceMeters,
        },
        update: {},
      });
    }

    if (matchesToCreate.length > 0) {
      await prisma.bloodRequest.update({
        where: { id: request.id },
        data: { status: 'PARTIALLY_MATCHED' },
      });
    }

    return matchesToCreate.length;
  }

  static async acceptMatch(matchId: string, userId: string, ipAddress?: string) {
    const donor = await prisma.donorProfile.findUnique({ where: { userId } });
    if (!donor) {
      throw { status: 404, message: 'Donor profile not found.' };
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { request: { include: { hospital: true } } },
    });

    if (!match || match.donorId !== donor.id) {
      throw { status: 404, message: 'Match alert not found or unauthorized.' };
    }

    if (match.status === 'ACCEPTED') {
      return match;
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'ACCEPTED',
        respondedAt: new Date(),
      },
      include: { request: { include: { hospital: true } } },
    });

    await AuditService.log({
      userId,
      action: 'MATCH_ACCEPTED',
      entity: 'Match',
      entityId: matchId,
      details: { requestId: match.requestId, hospitalName: match.request.hospital.name },
      ipAddress,
    });

    return updatedMatch;
  }

  static async getHospitalRequests(userId: string) {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) {
      throw { status: 404, message: 'Hospital profile not found.' };
    }

    return prisma.bloodRequest.findMany({
      where: { hospitalId: hospital.id },
      include: {
        matches: {
          include: {
            donor: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                bloodGroup: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async confirmFulfillment(requestId: string, donorId: string, userId: string, ipAddress?: string) {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) {
      throw { status: 404, message: 'Hospital profile not found.' };
    }

    const request = await prisma.bloodRequest.findUnique({ where: { id: requestId } });
    if (!request || request.hospitalId !== hospital.id) {
      throw { status: 404, message: 'Blood request not found.' };
    }

    const match = await prisma.match.findUnique({
      where: { requestId_donorId: { requestId, donorId } },
    });

    if (!match) {
      throw { status: 404, message: 'Match record not found for this donor.' };
    }

    // Record donation and update donor cooldown (+56 days for Whole Blood)
    const now = new Date();
    const nextEligible = calculateNextEligibleDate(now, request.componentType as ComponentType);

    await prisma.$transaction([
      prisma.donation.create({
        data: {
          matchId: match.id,
          donorId,
          hospitalId: hospital.id,
          unitsDonated: 1,
        },
      }),
      prisma.match.update({
        where: { id: match.id },
        data: { status: 'COMPLETED' },
      }),
      prisma.donorProfile.update({
        where: { id: donorId },
        data: {
          lastDonationDate: now,
          nextEligibleDate: nextEligible,
        },
      }),
      prisma.bloodRequest.update({
        where: { id: requestId },
        data: {
          unitsFulfilled: { increment: 1 },
          status: request.unitsFulfilled + 1 >= request.unitsRequested ? 'FULFILLED' : 'PARTIALLY_MATCHED',
        },
      }),
    ]);

    await AuditService.log({
      userId,
      action: 'DONATION_FULFILLED_CONFIRMED',
      entity: 'Donation',
      entityId: requestId,
      details: { donorId, nextEligibleDate: nextEligible },
      ipAddress,
    });

    return { success: true, nextEligibleDate: nextEligible };
  }
}
