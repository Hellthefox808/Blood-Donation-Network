'use client';

import React, { useState } from 'react';
import { AlertCircle, MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { apiFetch } from '@/lib/api';

export interface MatchAlertProps {
  match: {
    id: string;
    status: string;
    distanceMeters: number;
    request: {
      bloodGroup: string;
      urgency: 'ROUTINE' | 'URGENT' | 'CRITICAL';
      notes?: string;
      hospital: {
        name: string;
        address: string;
        phone: string;
      };
    };
  };
  onAccepted?: () => void;
}

export const MatchAlertCard: React.FC<MatchAlertProps> = ({ match, onAccepted }) => {
  const [status, setStatus] = useState(match.status);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await apiFetch(`/matches/${match.id}/accept`, { method: 'POST' });
      setStatus('ACCEPTED');
      if (onAccepted) onAccepted();
    } catch (err: any) {
      alert(err.message || 'Failed to accept match.');
    } finally {
      setLoading(false);
    }
  };

  const distanceKm = (match.distanceMeters / 1000).toFixed(1);

  return (
    <div className={`p-5 rounded-xl border ${status === 'ACCEPTED' ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-red-200 shadow-md'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className={`w-5 h-5 ${match.request.urgency === 'CRITICAL' ? 'text-red-600 animate-pulse' : 'text-amber-500'}`} />
          <Badge variant={match.request.urgency.toLowerCase() as any}>
            {match.request.urgency} EMERGENCY
          </Badge>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-white">
            {match.request.bloodGroup.replace('_', '-')}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500 flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{distanceKm} km away</span>
        </span>
      </div>

      <div className="mt-3">
        <h4 className="font-semibold text-slate-900">{match.request.hospital.name}</h4>
        <p className="text-xs text-slate-600 mt-0.5">{match.request.hospital.address}</p>
        {match.request.notes && (
          <p className="text-xs text-slate-700 bg-slate-100 p-2.5 rounded-md mt-2 italic">
            "{match.request.notes}"
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {status === 'ACCEPTED' ? (
          <div className="w-full flex items-center justify-between text-emerald-800 bg-emerald-100 p-2.5 rounded-lg text-xs font-semibold">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ACCEPTED — Mission En Route</span>
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                match.request.hospital.address
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-emerald-700 underline font-bold"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>GPS Directions</span>
            </a>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            isLoading={loading}
            onClick={handleAccept}
          >
            ACCEPT EMERGENCY DONATION
          </Button>
        )}
      </div>
    </div>
  );
};
