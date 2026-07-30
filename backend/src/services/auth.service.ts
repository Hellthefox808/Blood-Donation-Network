import { prisma } from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { AuditService } from './audit.service';
import { Role } from '../types';

export class AuthService {
  static async registerDonor(input: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    bloodGroup: string;
    dateOfBirth: string;
    weightKg: number;
    latitude: number;
    longitude: number;
    ipAddress?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw { status: 409, message: 'An account with this email address already exists.' };
    }

    const passwordHash = await hashPassword(input.password);
    const dob = new Date(input.dateOfBirth);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: 'DONOR',
        isVerified: true,
        donorProfile: {
          create: {
            fullName: input.fullName,
            phone: input.phone,
            bloodGroup: input.bloodGroup,
            dateOfBirth: dob,
            weightKg: input.weightKg,
            isAvailable: true,
            nextEligibleDate: new Date(),
            latitude: input.latitude,
            longitude: input.longitude,
          },
        },
      },
      include: { donorProfile: true },
    });

    await AuditService.log({
      userId: user.id,
      action: 'USER_REGISTERED',
      entity: 'User',
      entityId: user.id,
      details: { role: 'DONOR', bloodGroup: input.bloodGroup },
      ipAddress: input.ipAddress,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: 'DONOR',
      donorId: user.donorProfile?.id,
    });

    return { user, token };
  }

  static async registerHospital(input: {
    email: string;
    password: string;
    name: string;
    licenseNumber: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
    ipAddress?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw { status: 409, message: 'An account with this email address already exists.' };
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: 'HOSPITAL_ADMIN',
        isVerified: false, // Requires Admin verification
        hospital: {
          create: {
            name: input.name,
            licenseNumber: input.licenseNumber,
            phone: input.phone,
            address: input.address,
            latitude: input.latitude,
            longitude: input.longitude,
            isApproved: false,
          },
        },
      },
      include: { hospital: true },
    });

    await AuditService.log({
      userId: user.id,
      action: 'HOSPITAL_REGISTERED',
      entity: 'Hospital',
      entityId: user.hospital?.id || user.id,
      details: { hospitalName: input.name, licenseNumber: input.licenseNumber },
      ipAddress: input.ipAddress,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: 'HOSPITAL_ADMIN',
      hospitalId: user.hospital?.id,
    });

    return { user, token };
  }

  static async login(email: string, password: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { donorProfile: true, hospital: true, bloodBank: true },
    });

    if (!user) {
      throw { status: 401, message: 'Invalid email or password.' };
    }

    const match = await comparePassword(password, user.passwordHash);
    if (!match) {
      throw { status: 401, message: 'Invalid email or password.' };
    }

    await AuditService.log({
      userId: user.id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user.id,
      details: { role: user.role },
      ipAddress,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      donorId: user.donorProfile?.id,
      hospitalId: user.hospital?.id,
      bloodBankId: user.bloodBank?.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        donorProfile: user.donorProfile,
        hospital: user.hospital,
        bloodBank: user.bloodBank,
      },
      token,
    };
  }
}
