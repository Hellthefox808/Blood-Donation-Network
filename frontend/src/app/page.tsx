import Link from 'next/link';
import { Heart, Activity, ShieldCheck, Zap, ArrowRight, Building2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-red-100 text-crimson-800 px-3 py-1 rounded-full text-xs font-semibold">
          <Activity className="w-4 h-4 text-crimson-600 animate-pulse" />
          <span>Real-Time Emergency Matching Platform</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Connecting Local Blood Donors with Hospitals <span className="text-crimson-600">In Seconds</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Blood Donation Network (BDN) replaces manual phone trees with PostGIS spatial proximity indexing and automated multi-channel alerts to deliver life-saving blood when every minute counts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Register as Voluntary Donor</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Hospital Sign In</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-lg bg-red-100 text-crimson-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sub-15 Min Emergency Match</h3>
          <p className="text-sm text-slate-600">
            Spatial PostGIS radius queries automatically filter compatible donors based on clinical ABO/Rh rules and driving distance.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">56-Day Cooldown Protection</h3>
          <p className="text-sm text-slate-600">
            Automated medical eligibility calculators enforce mandatory recovery windows between Whole Blood and Platelet donations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">HIPAA & Audit Compliant</h3>
          <p className="text-sm text-slate-600">
            Donor identity remains hidden until acceptance. High-privilege actions log immutable entries to system audit logs.
          </p>
        </div>
      </section>

      {/* Sandbox Demo Credentials Quick Bar */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Try the Sandbox Demo Accounts</h3>
          <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">Pre-Seeded Data</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p className="font-bold text-emerald-400 mb-1">Eligible Donor Account</p>
            <p>Email: john.donor@gmail.com</p>
            <p>Password: Password123!@#</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p className="font-bold text-sky-400 mb-1">Approved Hospital Admin</p>
            <p>Email: stjude@hospital.org</p>
            <p>Password: Password123!@#</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p className="font-bold text-amber-400 mb-1">System Super-Admin</p>
            <p>Email: admin@bdn.org</p>
            <p>Password: Password123!@#</p>
          </div>
        </div>
      </section>
    </div>
  );
}
