
"use client"

import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/types';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('coopnest_role') as UserRole;
    setRole(savedRole || 'MEMBER');
  }, []);

  if (!role) return null;

  const roleLabels: Record<UserRole, string> = {
    PRESIDENT: 'President & Administrator',
    ASSISTANT_PRESIDENT: 'Assistant President',
    SECRETARY_GENERAL: 'Secretary General',
    TREASURER: 'Treasurer & Accountant',
    AUDITOR: 'Financial Auditor',
    MEMBER: 'Society Member'
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <DashboardSidebar role={role} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/5 bg-card/30 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">{roleLabels[role]}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">O. Abraham</p>
                <p className="text-xs text-muted-foreground mt-1">ID: CN-2025-001</p>
              </div>
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src="https://picsum.photos/seed/user1/200/200" alt="Profile" />
                <AvatarFallback>OA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
