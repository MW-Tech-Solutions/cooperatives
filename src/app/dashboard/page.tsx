
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
  Loader2,
  ChevronDown,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, query, collection, where, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { sendGuarantorRequest } from '@/ai/flows/guarantor-notification-flow';

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
      for (const g of loan.guarantors) {
        await sendGuarantorRequest({
          memberName: loan.memberName,
          guarantorName: g.name,
          guarantorEmail: `${g.userId.toLowerCase()}@society.com`,
          loanAmount: loan.amount,
          systemName: settings.branding?.systemName || 'CoopNest'
        });
      }

      const loanRef = doc(db, 'loans', loan.id);
      updateDoc(loanRef, {
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Greeting */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-8 text-white shadow-lg"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-bold font-headline">Hello Abraham, Welcome to your {settings?.branding?.systemName || 'CoopNest'} Dashboard</h1>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none translate-x-10 translate-y-10">
           <ShieldCheck className="w-64 h-64" />
        </div>
      </motion.div>

      {/* Onboarding Status */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between p-6 bg-white border border-emerald-100 rounded-2xl shadow-sm"
      >
        <div>
          <h2 className="font-bold text-lg">Complete Your Society Onboarding</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-emerald-600 font-bold">100% completed.</span>
            <span className="text-muted-foreground text-sm">Complete steps to unlock full experience</span>
          </div>
        </div>
        <Button variant="outline" className="rounded-full gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
          <ChevronDown className="w-4 h-4" /> Show
        </Button>
      </motion.div>

      {/* Main Stat Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatCard 
          title="Member ID" 
          value="CN/2025/001" 
          subtitle="NextGen Cohort"
          icon={CheckCircle2} 
          className="bg-emerald-500 text-white" 
          check
        />
        <StatCard 
          title="Approved Assessments" 
          value="0" 
          subtitle="No pending reviews"
          icon={FileText} 
          className="bg-slate-900 text-white" 
        />
        <StatCard 
          title="Monthly Mandate" 
          value="₦10,000" 
          subtitle="Next debit: Mar 28"
          icon={CreditCard} 
          className="bg-orange-500 text-white" 
        />
      </motion.div>

      {/* Recent Activity / Approval Queue */}
      {role === 'PRESIDENT' && pendingNotifications && pendingNotifications.length > 0 && (
        <Card className="rounded-2xl border-emerald-100">
          <CardHeader>
            <CardTitle className="text-lg">Notification Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingNotifications.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div>
                  <p className="font-bold">{loan.memberName}</p>
                  <p className="text-sm text-muted-foreground">₦{loan.amount.toLocaleString()} Loan Request</p>
                </div>
                <Button 
                  size="sm"
                  disabled={processingId === loan.id}
                  onClick={() => handleApproveNotification(loan)}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {processingId === loan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve & Notify'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  className,
  check = false 
}: { 
  title: string, 
  value: string, 
  subtitle?: string,
  icon: any, 
  className?: string,
  check?: boolean
}) {
  return (
    <motion.div variants={itemVariants} className={cn("relative p-6 rounded-2xl shadow-lg flex items-center justify-between overflow-hidden", className)}>
      <div className="space-y-1 relative z-10">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
      </div>
      <div className="bg-white/20 p-3 rounded-xl relative z-10">
        <Icon className="w-6 h-6" />
      </div>
      {check && (
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
           <CheckCircle2 className="w-32 h-32" />
        </div>
      )}
    </motion.div>
  );
}
