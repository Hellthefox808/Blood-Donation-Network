import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata = {
  title: 'Blood Donation Network (BDN)',
  description: 'Real-Time Database-Driven Platform Connecting Donors with Hospitals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
          © 2026 Blood Donation Network (BDN). HIPAA & GDPR Compliant Real-Time Coordination Engine.
        </footer>
      </body>
    </html>
  );
}
