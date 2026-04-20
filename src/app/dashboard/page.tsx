
"use client"

import { useEffect, useState } from 'react';
import { UserRole, SystemSettings, Loan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  Users,
  ShieldCheck,
  Activity,
  Wallet,
  CheckCircle2,
  Mail,
  Loader2
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
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, query, collection, where, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { sendGuarantorRequest } from '@/ai/flows/guarantor-notification-flow';

const chartData = [
  { name: 'Jan', total: 4000 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 5000 },
  { name: 'Apr', total: 4780 },
  { name: 'May', total: 5890 },
  { name: 'Jun', total: 6390 },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function DashboardOverview() {
  const [role, setRole] = useState<UserRole | null>(null);
  const db = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'global') : null, [db]);
  const { data: settings } = useDoc<SystemSettings>(settingsRef);

  const pendingNotifQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'loans'), where('status', '==', 'AWAITING_NOTIFICATION_APPROVAL'));
  }, [db]);
  const { data: pendingNotifications } = useCollection<Loan>(pendingNotifQuery);

  useEffect(() => {
    setRole(localStorage.getItem('coopnest_role') as UserRole || 'MEMBER');
  }, []);

  const handleApproveNotification = async (loan: Loan) => {
    if (!db || !settings) return;
    setProcessingId(loan.id);

    try {
      // Simulate sending emails to each guarantor via AI flow
      for (const g of loan.guarantors) {
        await sendGuarantorRequest({
          memberName: loan.memberName,
          guarantorName: g.name,
          guarantorEmail: `${g.userId.toLowerCase()}@society.com`,
          loanAmount: loan.amount,
          systemName: settings.branding?.systemName || 'CoopNest'
        });
      }

      // Update Firestore status
      const loanRef = doc(db, 'loans', loan.id);
      await updateDoc(loanRef, {
        status: 'AWAITING_GUARANTORS',
        notificationsSentAt: new Date().toISOString()
      });

      toast({ title: "Guarantors Notified", description: `Notifications sent for ${loan.memberName}'s loan.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Notification Error", description: e.message });
    } finally {
      setProcessingId(null);
    }
  };

  if (!role) return null;

  const renderRoleSpecificWidgets = () => {
    switch(role) {
      case 'PRESIDENT':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Pool Liquidity" value={`₦${(settings?.totalPoolLiquidity || 0).toLocaleString()}`} icon={Wallet} trend="+12.2%" delay={0.1} />
              <StatCard title="Active Members" value="214" icon={Users} trend="+8" delay={0.2} />
              <StatCard title="Loan Exposure" value="₦12.4M" icon={TrendingUp} variant="destructive" delay={0.3} />
              <StatCard title="Auto-Debit Status" value={settings?.isAutoDebitActive ? "ACTIVE" : "PAUSED"} icon={Activity} delay={0.4} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 glass-card overflow-hidden">
                <CardHeader><CardTitle>Financial Inflow Trends</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ChartWidget data={chartData} />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Pending Notifications
                    </CardTitle>
                    <CardDescription>Approve guarantor contact requests.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingNotifications?.map((loan) => (
                      <div key={loan.id} className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold">{loan.memberName}</p>
                            <p className="text-xs text-muted-foreground">₦{loan.amount.toLocaleString()}</p>
                          </div>
                          <p className="text-[10px] bg-white/5 px-2 py-0.5 rounded uppercase font-bold text-muted-foreground">
                            {loan.guarantors.length} Guarantors
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full" 
                          disabled={processingId === loan.id}
                          onClick={() => handleApproveNotification(loan)}
                        >
                          {processingId === loan.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                          Approve & Notify
                        </Button>
                      </div>
                    ))}
                    {(!pendingNotifications || pendingNotifications.length === 0) && (
                      <div className="text-center py-6 text-xs text-muted-foreground">
                        No pending notifications.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Governance Queue</CardTitle>
                    <CardDescription>Final approvals for verified loans.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      <p className="text-sm font-bold">₦4.5M Project Loan</p>
                      <p className="text-xs text-muted-foreground mb-3">Verified by Sec-Gen & Treasurer</p>
                      <Button size="sm" className="w-full shadow-lg shadow-primary/20">Review & Approve</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        );
      case 'TREASURER':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Pending Disbursements" value="₦840,000" icon={CreditCard} delay={0.1} />
              <StatCard title="Ledger Health" value="OPTIMAL" icon={CheckCircle2} delay={0.2} />
              <StatCard title="Pool Balance" value="₦24.8M" icon={Wallet} delay={0.3} />
            </div>
            <Card className="glass-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Ledger Hot-View</CardTitle>
                  <Button variant="outline" size="sm" asChild><Link href="/dashboard/treasury">Open Treasury</Link></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-12">
                  <Activity className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  All accounts reconciled for today.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'AUDITOR':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <div className="glass-card p-8 rounded-2xl border-emerald-500/20 bg-emerald-500/5 flex items-center gap-6">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-headline">Enterprise Transparency Active</h2>
                <p className="text-muted-foreground">Immutable audit logs are being streamed in real-time. System integrity: 100%.</p>
              </div>
            </div>
            <Card className="glass-card">
              <CardHeader><CardTitle>Recent System Shifts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="text-xs font-mono p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-muted-foreground">[2025-03-01 09:15:42] CONFIG_CHANGE: LOAN_MULTIPLIER (3x -> 3.5x)</span>
                    <span className="text-[9px] uppercase border px-1 rounded opacity-50">Verified</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        );
      default: // MEMBER
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 glass-card relative overflow-hidden group">
              <motion.div 
                className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Available Savings Pool</CardTitle>
                <div className="text-5xl font-bold font-headline mt-4">₦1,240,500.00</div>
              </CardHeader>
              <CardContent className="mt-8 space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Loan Eligibility Limit</p>
                    <p className="text-2xl font-bold text-accent">₦3,721,500 (3x)</p>
                  </div>
                  <Button size="lg" className="shadow-xl shadow-primary/20" asChild>
                    <Link href="/dashboard/savings">Request Loan</Link>
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Mandate Progress (Mar 2025)</span>
                    <span className="font-bold">Pending Debit: Mar 28</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary" 
                      initial={{ width: 0 }} 
                      animate={{ width: '65%' }} 
                      transition={{ duration: 1.5, ease: "easeOut" }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card flex flex-col justify-center items-center py-12">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <CreditCard className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-1">Active Mandate</h3>
              <p className="text-sm text-muted-foreground mb-6">Visa Ending in 8841</p>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-accent/20 rounded-full border border-accent/30">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-widest">Encrypted</span>
              </div>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Control Portal
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Session Protocol: <span className="text-primary">{role.replace('_', ' ')}</span></p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 glass-card rounded-full border-white/5 shadow-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Financial Rails: Online</span>
        </div>
      </header>

      {renderRoleSpecificWidgets()}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, variant, delay = 0 }: { title: string, value: string, icon: any, trend?: string, variant?: 'default' | 'destructive', delay?: number }) {
  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay }}>
      <Card className="glass-card border-white/5 hover:border-white/20 transition-all group cursor-default">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
          <div className={cn("p-2 rounded-lg transition-colors", variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary group-hover:bg-primary/20')}>
            <Icon className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-headline">{value}</div>
          {trend && (
            <p className="text-[11px] text-accent font-bold flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3" /> {trend} period growth
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChartWidget({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#64748b" 
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
          dy={10}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(v) => `₦${v/1000}k`}
        />
        <Tooltip 
          cursor={{ fill: '#ffffff05' }}
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
          itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
        />
        <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
