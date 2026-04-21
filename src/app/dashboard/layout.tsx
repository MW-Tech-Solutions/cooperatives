
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, SystemSettings } from '@/lib/types';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Mail, Sparkles, Menu, LogOut, Loader2 } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase, useAuth, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const [role, setRole] = useState<UserRole | null>(null);

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'global') : null, [db]);
  const { data: settings } = useDoc<SystemSettings>(settingsRef);

  const userProfileRef = useMemoFirebase(() => (db && user) ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: userProfile, loading: profileLoading } = useDoc<any>(userProfileRef);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (userProfile) {
      setRole(userProfile.role as UserRole);
      localStorage.setItem('coopnest_role', userProfile.role);
    } else if (!profileLoading && user) {
      // Fallback if profile doesn't exist yet but user is logged in
      setRole('MEMBER');
    }
  }, [userProfile, profileLoading, user]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('coopnest_role');
    router.push('/login');
  };

  if (authLoading || (user && !role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="font-bold text-slate-600 animate-pulse">Securing session...</p>
      </div>
    );
  }

  const systemName = settings?.branding?.systemName || 'CoopNest';
  const logoUrl = settings?.branding?.logoUrl || '';

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={role || 'MEMBER'} systemName={systemName} logoUrl={logoUrl} />
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
               {role?.replace('_', ' ')}
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 transition-all">
              <Mail className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 ml-2 group cursor-pointer" onClick={handleLogout}>
              <Avatar className="h-12 w-12 border-2 border-emerald-500 p-0.5">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200/200`} alt="Profile" className="rounded-full" />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {user?.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-black text-slate-900 leading-none">{userProfile?.name || 'Fellow Member'}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Sign Out</p>
              </div>
              <LogOut className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-10 overflow-auto pb-32 md:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
