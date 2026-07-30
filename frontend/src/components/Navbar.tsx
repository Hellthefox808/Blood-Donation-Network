'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartPulse, LogOut, UserCheck } from 'lucide-react';
import { getAuthUser, clearAuthSession, AuthUser } from '@/lib/auth-store';

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-lg bg-crimson-600 flex items-center justify-center text-white">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Blood Donation Network</span>
        </Link>

        <nav className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full text-slate-300 flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.email} ({user.role})</span>
              </span>
              {user.role === 'DONOR' && (
                <Link href="/donor" className="text-sm font-medium hover:text-crimson-400">
                  Donor Console
                </Link>
              )}
              {user.role === 'HOSPITAL_ADMIN' && (
                <Link href="/hospital" className="text-sm font-medium hover:text-crimson-400">
                  Hospital Dashboard
                </Link>
              )}
              {user.role === 'SYSTEM_ADMIN' && (
                <Link href="/admin" className="text-sm font-medium hover:text-crimson-400">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 border border-slate-700 px-2.5 py-1.5 rounded-md"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-crimson-600 hover:bg-crimson-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
