
"use client"

import { useEffect, useState } from 'react';
import { UserRole, SystemSettings } from '@/lib/types';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Mail, Sparkles } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const db = useFirestore();

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'global') : null, [db]);
  const { data: settings } = useDoc<SystemSettings>(settingsRef);

  useEffect(() => {
    const savedRole = localStorage.getItem('coopnest_role') as UserRole;
    setRole(savedRole || 'MEMBER');
  }, []);

  if (!role) return null;

  const systemName = settings?.branding?.systemName || 'CoopNest';
  const logoUrl = settings?.branding?.logoUrl || '';

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={role} systemName={systemName} logoUrl={logoUrl} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-emerald-100 bg-white flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
             <div className="md:hidden flex items-center gap-2">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded" />
                ) : (
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
             </div>
             <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-3 py-1 text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
               {role.replace('_', ' ')}
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
              <Mail className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <Avatar className="h-10 w-10 ring-2 ring-emerald-100 ring-offset-2">
              <AvatarImage src="https://picsum.photos/seed/user1/200/200" alt="Profile" />
              <AvatarFallback className="bg-emerald-100 text-emerald-700">OA</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
