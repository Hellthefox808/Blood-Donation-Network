'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Building, Mail, Key, Phone, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { apiFetch } from '@/lib/api';
import { setAuthSession } from '@/lib/auth-store';

export default function RegisterPage() {
  const [role, setRole] = useState<'DONOR' | 'HOSPITAL'>('DONOR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O_NEGATIVE');
  const [weightKg, setWeightKg] = useState(70);
  const [hospitalName, setHospitalName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (role === 'DONOR') {
        const res: any = await apiFetch('/auth/register/donor', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            fullName,
            phone,
            bloodGroup,
            dateOfBirth: '1995-06-15',
            weightKg: Number(weightKg),
            latitude: 37.7749,
            longitude: -122.4194,
          }),
        });
        setAuthSession(res.data.token, res.data.user);
        router.push('/donor');
      } else {
        const res: any = await apiFetch('/auth/register/hospital', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            name: hospitalName,
            licenseNumber,
            phone,
            address,
            latitude: 37.7749,
            longitude: -122.4194,
          }),
        });
        setAuthSession(res.data.token, res.data.user);
        router.push('/hospital');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card title="Create an Account" subtitle="Join the real-time blood emergency network">
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setRole('DONOR')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center space-x-2 border-b-2 ${
              role === 'DONOR'
                ? 'border-crimson-600 text-crimson-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Voluntary Donor</span>
          </button>
          <button
            onClick={() => setRole('HOSPITAL')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center space-x-2 border-b-2 ${
              role === 'HOSPITAL'
                ? 'border-crimson-600 text-crimson-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Hospital / Clinic</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
              />
            </div>
          </div>

          {role === 'DONOR' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+14155550199"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500 bg-white"
                  >
                    <option value="O_NEGATIVE">O Negative (O-)</option>
                    <option value="O_POSITIVE">O Positive (O+)</option>
                    <option value="A_NEGATIVE">A Negative (A-)</option>
                    <option value="A_POSITIVE">A Positive (A+)</option>
                    <option value="B_NEGATIVE">B Negative (B-)</option>
                    <option value="B_POSITIVE">B Positive (B+)</option>
                    <option value="AB_NEGATIVE">AB Negative (AB-)</option>
                    <option value="AB_POSITIVE">AB Positive (AB+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min={50}
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="St. Jude Regional Hospital"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Medical License No.
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="CA-MED-88912"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+14155550199"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="750 Mission St, San Francisco, CA"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-crimson-500"
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full mt-2" isLoading={loading}>
            Complete Registration
          </Button>

          <p className="text-xs text-center text-slate-500 pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-crimson-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
