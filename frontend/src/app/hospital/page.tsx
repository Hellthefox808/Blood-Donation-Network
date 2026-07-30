'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Activity, CheckCircle, Clock, AlertCircle, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import { getAuthUser } from '@/lib/auth-store';

export default function HospitalDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // New request form state
  const [bloodGroup, setBloodGroup] = useState('O_NEGATIVE');
  const [componentType, setComponentType] = useState('WHOLE_BLOOD');
  const [unitsRequested, setUnitsRequested] = useState(2);
  const [urgency, setUrgency] = useState('CRITICAL');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const fetchRequests = async () => {
    try {
      const res: any = await apiFetch('/hospitals/requests');
      setRequests(res.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== 'HOSPITAL_ADMIN') {
      router.push('/login');
      return;
    }
    fetchRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const requiredBy = new Date(Date.now() + 6 * 3600 * 1000).toISOString();
      await apiFetch('/hospitals/requests', {
        method: 'POST',
        body: JSON.stringify({
          bloodGroup,
          componentType,
          unitsRequested: Number(unitsRequested),
          urgency,
          requiredBy,
          notes,
        }),
      });
      setShowModal(false);
      setNotes('');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to create blood request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmFulfillment = async (requestId: string, donorId: string) => {
    try {
      await apiFetch('/hospitals/donations/confirm', {
        method: 'POST',
        body: JSON.stringify({ requestId, donorId }),
      });
      alert('✓ Donation unit receipt confirmed! Donor cooldown updated.');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm receipt.');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500 text-sm">Loading hospital requests...</div>;
  }

  return (
    <div className="space-y-8 py-4">
      {/* Dashboard Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-crimson-600" />
            <span>Hospital Emergency Command Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast emergency requests & track matched voluntary donor arrival ETAs
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} className="space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>New Blood Request</span>
        </Button>
      </div>

      {/* Active Requests List */}
      <div className="space-y-6">
        {requests.map((req) => (
          <Card
            key={req.id}
            title={`Request #${req.id.substring(0, 8).toUpperCase()} — ${req.bloodGroup.replace('_', '-')} (${req.unitsFulfilled}/${req.unitsRequested} Units)`}
            subtitle={`Created ${new Date(req.createdAt).toLocaleTimeString()} • Urgency: ${req.urgency}`}
            action={
              <Badge variant={req.urgency.toLowerCase() as any}>
                {req.urgency}
              </Badge>
            }
          >
            <div className="space-y-4">
              {req.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg italic">
                  "{req.notes}"
                </p>
              )}

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Matched Donor Responses ({req.matches?.length || 0})
              </h4>

              {req.matches && req.matches.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 px-3">Donor Name</th>
                        <th className="py-2 px-3">Blood Group</th>
                        <th className="py-2 px-3">Distance</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {req.matches.map((m: any) => (
                        <tr key={m.id}>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {m.status === 'ACCEPTED' ? m.donor.fullName : `Donor #${m.donor.id.substring(0, 6)} (Hidden)`}
                          </td>
                          <td className="py-2.5 px-3">{m.donor.bloodGroup.replace('_', '-')}</td>
                          <td className="py-2.5 px-3">{(m.distanceMeters / 1000).toFixed(1)} km</td>
                          <td className="py-2.5 px-3">
                            <Badge variant={m.status === 'ACCEPTED' ? 'success' : 'neutral'}>
                              {m.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {m.status === 'ACCEPTED' && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleConfirmFulfillment(req.id, m.donor.id)}
                              >
                                Confirm Unit Receipt
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Searching nearby eligible donors...</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Creating Emergency Request */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Create Emergency Blood Request</h3>
            
            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Required Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="O_NEGATIVE">O Negative (Universal Red Cell)</option>
                  <option value="O_POSITIVE">O Positive</option>
                  <option value="A_NEGATIVE">A Negative</option>
                  <option value="A_POSITIVE">A Positive</option>
                  <option value="B_NEGATIVE">B Negative</option>
                  <option value="B_POSITIVE">B Positive</option>
                  <option value="AB_NEGATIVE">AB Negative</option>
                  <option value="AB_POSITIVE">AB Positive</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Units Needed
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={unitsRequested}
                    onChange={(e) => setUnitsRequested(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ROUTINE">Routine (10 km radius)</option>
                    <option value="URGENT">Urgent (25 km radius)</option>
                    <option value="CRITICAL">Critical (50 km radius)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical / Operating Room Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Trauma patient in OR 3 requiring immediate transfusions."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={submitting}>
                  Broadcast Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
