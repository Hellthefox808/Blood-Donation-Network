export interface AuthUser {
  id: string;
  email: string;
  role: 'DONOR' | 'HOSPITAL_ADMIN' | 'BLOOD_BANK_MANAGER' | 'SYSTEM_ADMIN';
  isVerified: boolean;
  donorProfile?: any;
  hospital?: any;
}

export function setAuthSession(token: string, user: AuthUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bdn_token', token);
    localStorage.setItem('bdn_user', JSON.stringify(user));
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('bdn_user');
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}

export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bdn_token');
    localStorage.removeItem('bdn_user');
  }
}
