
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard, 
  FileText, 
  Search, 
  LogOut,
  ShieldAlert,
  Wallet,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { motion } from 'framer-motion';

interface SidebarProps {
  role: UserRole;
  systemName?: string;
  logoUrl?: string;
}

export function DashboardSidebar({ role, systemName = 'CoopNest', logoUrl }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['PRESIDENT', 'ASSISTANT_PRESIDENT', 'SECRETARY_GENERAL', 'TREASURER', 'AUDITOR', 'MEMBER'] },
    { name: 'My Wealth', href: '/dashboard/savings', icon: Wallet, roles: ['MEMBER'] },
    { name: 'Registry', href: '/dashboard/members', icon: Users, roles: ['PRESIDENT', 'ASSISTANT_PRESIDENT', 'SECRETARY_GENERAL', 'TREASURER', 'AUDITOR'] },
    { name: 'Treasury', href: '/dashboard/treasury', icon: CreditCard, roles: ['PRESIDENT', 'TREASURER'] },
    { name: 'Audit Hub', href: '/dashboard/audit', icon: Search, roles: ['PRESIDENT', 'AUDITOR'] },
    { name: 'Governance', href: '/dashboard/governance', icon: ShieldAlert, roles: ['PRESIDENT', 'SECRETARY_GENERAL'] },
    { name: 'System Settings', href: '/dashboard/settings', icon: Settings, roles: ['PRESIDENT'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <>
      <aside className="w-72 glass-sidebar hidden md:flex flex-col h-screen sticky top-0 z-50">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Sparkles className="w-6 h-6 text-white" />
              )}
            </div>
            <span className="text-xl font-headline font-bold tracking-tighter truncate text-emerald-950">{systemName}</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" 
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600")} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 mt-auto">
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out Securely
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] h-20 bg-white border-t border-emerald-100 flex items-stretch px-2 pb-safe shadow-2xl">
        {filteredItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                isActive ? "text-emerald-600" : "text-slate-400"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-emerald-50" : ""
              )}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tighter truncate max-w-full">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
