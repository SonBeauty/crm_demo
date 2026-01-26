import Sidebar from '@/components/dashboard/Sidebar';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Toaster richColors position="top-right" theme="dark" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-0 relative">
          <div className="absolute top-4 right-4 z-50">
            <NotificationCenter />
          </div>
          <div className="min-h-screen p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
