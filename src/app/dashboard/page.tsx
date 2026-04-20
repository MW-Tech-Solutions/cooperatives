
"use client"

import { useEffect, useState } from 'react';
import { UserRole, SystemSettings } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  AlertCircle,
  Users,
  ShieldCheck,
  FileText,
  Activity,
  Wallet,
  Gavel
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from 'recharts';
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const chartData = [
  { name: 'Jan', total: 4000 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 2000 },
  { name: 'Apr', total: 2780 },
  { name: 'May', total: 1890 },
  { name: 'Jun', total: 2390 },
];

export default function DashboardOverview() {
  const [role, setRole] = useState<UserRole | null>(null);
  const db = useFirestore();
  
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'global') : null, [db]);
  const { data: settings } = useDoc<SystemSettings>(settingsRef);

  useEffect(() => {
    setRole(localStorage.getItem('coopnest_role') as UserRole || 'MEMBER');
  }, []);

  if (!role) return null;

  const renderRoleSpecificWidgets = () => {
    switch(role) {
      case 'PRESIDENT':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Pool Liquidity" value={`₦${(settings?.totalPoolLiquidity || 0).toLocaleString()}`} icon={Wallet} trend="+5.2%" />
              <StatCard title="Active Members" value="154" icon={Users} trend="+12" />
              <StatCard title="Loan Exposure" value="₦4.2M" icon={TrendingUp} variant="destructive" />
              <StatCard title="Auto-Debit Status" value={settings?.isAutoDebitActive ? "ACTIVE" : "PAUSED"} icon={Activity} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <Card className="lg:col-span-2 bg-card/50 border-white/5 shadow-xl">
                <CardHeader><CardTitle>Financial Inflow Trends</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ChartWidget data={chartData} />
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-white/5 shadow-xl">
                <CardHeader><CardTitle>Critical Approvals</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="text-sm font-bold">₦2.5M Project Loan</p>
                    <p className="text-xs text-muted-foreground">Awaiting Presidential Sign-off</p>
                    <Button size="sm" className="mt-3 w-full">Review Application</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
      case 'SECRETARY_GENERAL':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle>Onboarding Pipeline</CardTitle>
                <CardDescription>Members awaiting verification.</CardDescription>
              </CardHeader>
              <CardContent>
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">JD</div>
                      <div>
                        <p className="text-sm font-medium">New Member Application #{100+i}</p>
                        <p className="text-xs text-muted-foreground">Submitted 2h ago</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Verify</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-white/5">
              <CardHeader><CardTitle>Governance Docs</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-2 text-xs"><FileText className="w-4 h-4" /> Meeting Minutes - Feb</Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-xs"><FileText className="w-4 h-4" /> Society Bylaws v2.4</Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'TREASURER':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Daily Payouts" value="₦120,000" icon={CreditCard} />
              <StatCard title="Pending Tokenizations" value="45" icon={Activity} />
              <StatCard title="Bank Balance" value="₦8.4M" icon={Wallet} />
            </div>
            <Card className="bg-card/50 border-white/5">
              <CardHeader><CardTitle>Ledger Quick View</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">No pending disbursements for today.</div>
              </CardContent>
            </Card>
          </div>
        );
      case 'AUDITOR':
        return (
          <div className="space-y-8">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4">
              <ShieldCheck className="w-12 h-12 text-accent" />
              <div>
                <h2 className="text-xl font-bold">Transparency View Active</h2>
                <p className="text-sm text-muted-foreground">Read-only access to all system transactions and settings changes.</p>
              </div>
            </div>
            <Card className="bg-card/50 border-white/5">
              <CardHeader><CardTitle>Live System Logs</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="text-xs font-mono p-2 bg-white/5 rounded">
                    [2025-02-28 14:22:01] ACTION: SETTINGS_UPDATE | ACTOR: PRESIDENT | TARGET: LOAN_RATE
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      default: // MEMBER
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-card/50 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Wallet className="w-32 h-32" /></div>
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm uppercase">My Savings Pool</CardTitle>
                <div className="text-4xl font-bold font-headline mt-2">₦450,000.00</div>
              </CardHeader>
              <CardContent>
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Loan Eligibility Meter</p>
                      <p className="text-xl font-bold text-accent">₦1,350,000 (3x)</p>
                    </div>
                    <Button asChild><Link href="/dashboard/savings">Manage Savings</Link></Button>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '45%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-white/5">
              <CardHeader><CardTitle>Active Mandate</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CreditCard className="w-12 h-12 text-primary mb-4" />
                <p className="text-sm font-bold">Visa Ending in 4242</p>
                <p className="text-xs text-muted-foreground">Next Debit: Mar 28, 2025</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Governance Portal</h1>
          <p className="text-muted-foreground">Session: {role.replace('_', ' ')}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-accent">Financial Rails Synchronized</span>
        </div>
      </div>

      {renderRoleSpecificWidgets()}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, variant }: { title: string, value: string, icon: any, trend?: string, variant?: 'default' | 'destructive' }) {
  return (
    <Card className="bg-card/50 border-white/5 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">{title}</CardTitle>
        <Icon className={cn("w-4 h-4", variant === 'destructive' ? 'text-destructive' : 'text-primary')} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{value}</div>
        {trend && (
          <p className="text-[10px] text-accent flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> {trend} growth
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ChartWidget({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
