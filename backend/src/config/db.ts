import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✓ Database connected successfully via Prisma Client');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}
