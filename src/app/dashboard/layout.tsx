"use client"

import { useEffect, useState } from 'react';
import { UserRole, SystemSettings } from '@/lib/types';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Mail, Sparkles, Menu } from 'lucide-react';
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
        <header className="h-20 border-b border-emerald-50 bg-white/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
             <div className="md:hidden flex items-center gap-4">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded" />
                ) : (
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                )}
                <button className="p-2 text-slate-800">
                  <Menu className="w-7 h-7" />
                </button>
             </div>
             <div className="hidden md:flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100">
               {role.replace('_', ' ')}
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 transition-all">
              <Mail className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <Avatar className="h-12 w-12 border-2 border-emerald-500 p-0.5 ml-2">
              <AvatarImage src="https://picsum.photos/seed/user1/200/200" alt="Profile" className="rounded-full" />
              <AvatarFallback className="bg-emerald-100 text-emerald-700">OA</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-10 overflow-auto pb-32 md:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
