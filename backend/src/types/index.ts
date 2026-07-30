export type Role = 'DONOR' | 'HOSPITAL_ADMIN' | 'BLOOD_BANK_MANAGER' | 'SYSTEM_ADMIN';

export type BloodGroup =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE';

export type ComponentType =
  | 'WHOLE_BLOOD'
  | 'PACKED_RED_BLOOD_CELLS'
  | 'PLATELETS'
  | 'FRESH_FROZEN_PLASMA'
  | 'CRYOPRECIPITATE';

export type RequestUrgency = 'ROUTINE' | 'URGENT' | 'CRITICAL';

export type RequestStatus =
  | 'SEARCHING'
  | 'PARTIALLY_MATCHED'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED';

export type MatchStatus = 'NOTIFIED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'COMPLETED';

export interface UserPayload {
  userId: string;
  email: string;
  role: Role;
  hospitalId?: string;
  donorId?: string;
  bloodBankId?: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  invalidParams?: Array<{ name: string; reason: string }>;
}
