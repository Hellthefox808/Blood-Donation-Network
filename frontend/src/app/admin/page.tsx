'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Check, X, FileText, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import { getAuthUser } from '@/lib/auth-store';

export default function AdminPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [hospRes, logRes]: any = await Promise.all([
        apiFetch('/admin/hospitals/pending'),
        apiFetch('/admin/audit-logs'),
      ]);
      setHospitals(hospRes.data || []);
      setLogs(logRes.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== 'SYSTEM_ADMIN') {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const handleVerify = async (hospitalId: string, isApproved: boolean) => {
    try {
      await apiFetch(`/admin/hospitals/${hospitalId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ isApproved }),
      });
      alert(`✓ Hospital accreditation ${isApproved ? 'APPROVED' : 'REJECTED'}.`);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500 text-sm">Loading admin dashboard...</div>;
  }

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-crimson-600" />
            <span>System Super-Admin Control Panel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage hospital accreditation documentation & review immutable security audit logs
          </p>
        </div>
      </div>

      {/* Pending Hospital Accreditation Verification Table */}
      <Card
        title={`Pending Hospital Accreditation Applications (${hospitals.length})`}
        subtitle="Verify state medical licenses before unlocking emergency request creation capabilities"
      >
        {hospitals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 px-3">Hospital Name</th>
                  <th className="py-2.5 px-3">License Number</th>
                  <th className="py-2.5 px-3">Contact Email</th>
                  <th className="py-2.5 px-3">Address</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hospitals.map((h) => (
                  <tr key={h.id}>
                    <td className="py-3 px-3 font-semibold text-slate-900">{h.name}</td>
                    <td className="py-3 px-3 font-mono text-crimson-700 bg-red-50 rounded px-1.5 py-0.5 inline-block my-1">
                      {h.licenseNumber}
                    </td>
                    <td className="py-3 px-3">{h.user?.email}</td>
                    <td className="py-3 px-3 text-slate-600">{h.address}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <Button size="sm" variant="success" onClick={() => handleVerify(h.id, true)}>
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleVerify(h.id, false)}>
                        <X className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">
            No pending hospital accreditation applications. All registered facilities are verified.
          </p>
        )}
      </Card>

      {/* Audit Logs Table */}
      <Card title="Security Audit Logs" subtitle="Immutable audit trail of high-privilege system operations">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="py-2.5 px-3 text-slate-500">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-sans">{l.user?.email || 'System'}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="neutral">{l.action}</Badge>
                  </td>
                  <td className="py-2.5 px-3">{l.entity}:{l.entityId.substring(0, 8)}</td>
                  <td className="py-2.5 px-3 text-slate-400">{l.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
