import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const defaultPasswordHash = await bcrypt.hash('Password123!@#', 10);

  // 1. System Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bdn.org' },
    update: {},
    create: {
      email: 'admin@bdn.org',
      passwordHash: defaultPasswordHash,
      role: 'SYSTEM_ADMIN',
      isVerified: true,
    },
  });

  // 2. Approved Hospital
  const hospitalUser = await prisma.user.upsert({
    where: { email: 'stjude@hospital.org' },
    update: {},
    create: {
      email: 'stjude@hospital.org',
      passwordHash: defaultPasswordHash,
      role: 'HOSPITAL_ADMIN',
      isVerified: true,
      hospital: {
        create: {
          name: 'St. Jude Regional Emergency Center',
          licenseNumber: 'CA-MED-88912',
          phone: '+14155550199',
          address: '750 Mission St, San Francisco, CA 94103',
          latitude: 37.7749,
          longitude: -122.4194,
          isApproved: true,
        },
      },
    },
    include: { hospital: true },
  });

  // 3. Unapproved Hospital
  await prisma.user.upsert({
    where: { email: 'mercy@clinic.org' },
    update: {},
    create: {
      email: 'mercy@clinic.org',
      passwordHash: defaultPasswordHash,
      role: 'HOSPITAL_ADMIN',
      isVerified: false,
      hospital: {
        create: {
          name: 'Mercy Community Clinic',
          licenseNumber: 'CA-MED-99410',
          phone: '+14155550288',
          address: '1200 Market St, San Francisco, CA 94102',
          latitude: 37.7800,
          longitude: -122.4150,
          isApproved: false,
        },
      },
    },
  });

  // 4. Eligible O-Negative Donor
  const donorUser = await prisma.user.upsert({
    where: { email: 'john.donor@gmail.com' },
    update: {},
    create: {
      email: 'john.donor@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'DONOR',
      isVerified: true,
      donorProfile: {
        create: {
          fullName: 'John Doe (Voluntary Donor)',
          phone: '+14155558812',
          bloodGroup: 'O_NEGATIVE',
          dateOfBirth: new Date('1990-05-15'),
          weightKg: 78.5,
          isAvailable: true,
          nextEligibleDate: new Date('2020-01-01'), // Fully eligible
          latitude: 37.7755, // ~4.2 km away
          longitude: -122.4180,
        },
      },
    },
    include: { donorProfile: true },
  });

  // 5. Create an initial Blood Request
  if (hospitalUser.hospital) {
    const req = await prisma.bloodRequest.create({
      data: {
        hospitalId: hospitalUser.hospital.id,
        bloodGroup: 'O_NEGATIVE',
        componentType: 'WHOLE_BLOOD',
        unitsRequested: 3,
        unitsFulfilled: 0,
        urgency: 'CRITICAL',
        status: 'PARTIALLY_MATCHED',
        requiredBy: new Date(Date.now() + 6 * 3600 * 1000), // 6 hours from now
        notes: 'Emergency trauma patient in OR 3 requiring immediate O- transfusions.',
      },
    });

    if (donorUser.donorProfile) {
      await prisma.match.create({
        data: {
          requestId: req.id,
          donorId: donorUser.donorProfile.id,
          status: 'NOTIFIED',
          distanceMeters: 4200,
        },
      });
    }
  }

  console.log('✓ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
