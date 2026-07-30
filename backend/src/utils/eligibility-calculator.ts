import { ComponentType } from '../types';

/**
 * Calculates the next eligible donation date based on component type and last donation date.
 * Clinical standards:
 * - Whole Blood: 56 days (8 weeks)
 * - Double Red Cells: 112 days (16 weeks)
 * - Platelets: 14 days (2 weeks)
 * - Plasma / default: 28 days (4 weeks)
 */
export function calculateNextEligibleDate(
  lastDonationDate: Date,
  componentType: ComponentType = 'WHOLE_BLOOD'
): Date {
  const result = new Date(lastDonationDate.getTime());
  
  switch (componentType) {
    case 'WHOLE_BLOOD':
      result.setDate(result.getDate() + 56);
      break;
    case 'PACKED_RED_BLOOD_CELLS':
      result.setDate(result.getDate() + 112);
      break;
    case 'PLATELETS':
      result.setDate(result.getDate() + 14);
      break;
    case 'FRESH_FROZEN_PLASMA':
    case 'CRYOPRECIPITATE':
    default:
      result.setDate(result.getDate() + 28);
      break;
  }

  return result;
}

/**
 * Checks if a donor is eligible based on their nextEligibleDate and availability status.
 */
export function isDonorEligible(
  nextEligibleDate: Date,
  isAvailable: boolean,
  currentDate: Date = new Date()
): boolean {
  if (!isAvailable) return false;
  return nextEligibleDate <= currentDate;
}

/**
 * Haversine distance formula in meters between two lat/long points.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
