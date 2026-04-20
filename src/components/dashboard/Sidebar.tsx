
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
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';

interface SidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['PRESIDENT', 'ASSISTANT_PRESIDENT', 'SECRETARY_GENERAL', 'TREASURER', 'AUDITOR', 'MEMBER'] },
    { name: 'My Savings', href: '/dashboard/savings', icon: Wallet, roles: ['MEMBER'] },
    { name: 'Member Directory', href: '/dashboard/members', icon: Users, roles: ['PRESIDENT', 'ASSISTANT_PRESIDENT', 'SECRETARY_GENERAL', 'TREASURER', 'AUDITOR'] },
    { name: 'Financial Control', href: '/dashboard/treasury', icon: CreditCard, roles: ['PRESIDENT', 'TREASURER'] },
    { name: 'Audit Logs', href: '/dashboard/audit', icon: Search, roles: ['PRESIDENT', 'AUDITOR'] },
    { name: 'Governance', href: '/dashboard/governance', icon: ShieldAlert, roles: ['PRESIDENT', 'SECRETARY_GENERAL'] },
    { name: 'System Settings', href: '/dashboard/settings', icon: Settings, roles: ['PRESIDENT'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-card border-r border-white/5 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-headline font-bold">CoopNest</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {filteredItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname === item.href 
                ? "bg-primary text-white" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <Link 
          href="/login"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
