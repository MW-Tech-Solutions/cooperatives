
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
  Sparkles
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
    { name: 'My Savings', href: '/dashboard/savings', icon: Wallet, roles: ['MEMBER'] },
    { name: 'Directory', href: '/dashboard/members', icon: Users, roles: ['PRESIDENT', 'ASSISTANT_PRESIDENT', 'SECRETARY_GENERAL', 'TREASURER', 'AUDITOR'] },
    { name: 'Treasury', href: '/dashboard/treasury', icon: CreditCard, roles: ['PRESIDENT', 'TREASURER'] },
    { name: 'Audit', href: '/dashboard/audit', icon: Search, roles: ['PRESIDENT', 'AUDITOR'] },
    { name: 'Control', href: '/dashboard/governance', icon: ShieldAlert, roles: ['PRESIDENT', 'SECRETARY_GENERAL'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['PRESIDENT'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-72 glass-sidebar hidden md:flex flex-col h-screen sticky top-0 z-50">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 shrink-0"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-6 h-6 rounded" />
              ) : (
                <Sparkles className="w-6 h-6 text-white" />
              )}
            </motion.div>
            <span className="text-2xl font-headline font-bold tracking-tighter truncate">{systemName}</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {filteredItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group relative overflow-hidden",
                pathname === item.href 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
              {item.name}
              {pathname === item.href && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 mt-auto">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Authority</p>
            <p className="text-xs font-bold text-primary truncate">{role.replace('_', ' ')}</p>
          </div>
          <Link 
            href="/login"
            className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout System
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] h-20 bg-card/80 backdrop-blur-2xl border-t border-white/10 flex items-stretch px-2 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {filteredItems.slice(0, 5).map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 relative",
              pathname === item.href 
                ? "text-primary font-bold" 
                : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              pathname === item.href ? "bg-primary/10 scale-110" : ""
            )}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-tighter leading-none text-center px-1 truncate max-w-full">
              {item.name}
            </span>
            {pathname === item.href && (
              <motion.div 
                layoutId="mobile-active"
                className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_12px_hsl(var(--primary))]"
              />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
