'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Activity, CheckCircle, Clock, AlertTriangle, Power } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MatchAlertCard } from '@/components/MatchAlertCard';
import { apiFetch } from '@/lib/api';
import { getAuthUser } from '@/lib/auth-store';

export default function DonorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res: any = await apiFetch('/donors/me');
      setProfile(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== 'DONOR') {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, []);

  const handleToggleAvailability = async () => {
    if (!profile) return;
    setToggling(true);
    try {
      const res: any = await apiFetch('/donors/availability', {
        method: 'PUT',
        body: JSON.stringify({ isAvailable: !profile.isAvailable }),
      });
      setProfile({ ...profile, isAvailable: res.data.isAvailable });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Loading your donor profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-12 text-center text-red-600 font-medium">
        Failed to load donor profile. Please log in again.
      </div>
    );
  }

  const isEligible = new Date(profile.nextEligibleDate) <= new Date();

  return (
    <div className="space-y-8 py-4">
      {/* Header Profile Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-crimson-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {profile.bloodGroup.replace('_', '-')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
            <p className="text-xs text-slate-500">{profile.phone} • Voluntary Blood Donor</p>
            <div className="flex items-center space-x-2 mt-1.5">
              {isEligible ? (
                <Badge variant="success" className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Clinically Eligible to Donate</span>
                </Badge>
              ) : (
                <Badge variant="warning" className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Under Cooldown until {new Date(profile.nextEligibleDate).toLocaleDateString()}
                  </span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant={profile.isAvailable ? 'danger' : 'success'}
            size="sm"
            isLoading={toggling}
            onClick={handleToggleAvailability}
            className="space-x-1.5"
          >
            <Power className="w-4 h-4" />
            <span>{profile.isAvailable ? 'Pause Notifications' : 'Make Available'}</span>
          </Button>
        </div>
      </div>

      {/* Active Match Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-crimson-600" />
            <span>Matched Emergency Alerts ({profile.matches?.length || 0})</span>
          </h3>
        </div>

        {profile.matches && profile.matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.matches.map((m: any) => (
              <MatchAlertCard key={m.id} match={m} onAccepted={fetchProfile} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 text-slate-500">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No Active Emergency Requests Nearby</p>
            <p className="text-xs text-slate-400 mt-1">
              Thank you for keeping your availability active. You will receive real-time push alerts when a nearby hospital requests your blood type.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
