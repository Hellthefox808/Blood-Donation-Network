import { BloodGroup } from '../types';

/**
 * Clinical Red Cell Blood Compatibility Matrix
 * Maps recipient blood group to array of compatible donor blood groups.
 */
export const RED_CELL_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  O_NEGATIVE: ['O_NEGATIVE'],
  O_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE'],
  A_NEGATIVE: ['O_NEGATIVE', 'A_NEGATIVE'],
  A_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE', 'A_NEGATIVE', 'A_POSITIVE'],
  B_NEGATIVE: ['O_NEGATIVE', 'B_NEGATIVE'],
  B_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE', 'B_NEGATIVE', 'B_POSITIVE'],
  AB_NEGATIVE: ['O_NEGATIVE', 'A_NEGATIVE', 'B_NEGATIVE', 'AB_NEGATIVE'],
  AB_POSITIVE: [
    'O_NEGATIVE',
    'O_POSITIVE',
    'A_NEGATIVE',
    'A_POSITIVE',
    'B_NEGATIVE',
    'B_POSITIVE',
    'AB_NEGATIVE',
    'AB_POSITIVE',
  ],
};

/**
 * Returns list of compatible donor blood types for a given recipient blood type.
 */
export function getCompatibleDonorBloodGroups(recipientBloodGroup: BloodGroup): BloodGroup[] {
  return RED_CELL_COMPATIBILITY[recipientBloodGroup] || [recipientBloodGroup];
}
