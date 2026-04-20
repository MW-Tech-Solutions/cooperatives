
"use client"

import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

const data = [
  { name: 'Jan', total: 4000 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 2000 },
  { name: 'Apr', total: 2780 },
  { name: 'May', total: 1890 },
  { name: 'Jun', total: 2390 },
];

export default function DashboardOverview() {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('coopnest_role') as UserRole || 'MEMBER');
  }, []);

  if (!role) return null;

  const isAdmin = role === 'PRESIDENT' || role === 'ASSISTANT_PRESIDENT';
  const isFinancial = role === 'TREASURER' || role === 'AUDITOR' || role === 'PRESIDENT';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">System Overview</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-accent">Auto-Debit Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-white/5 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Society Assets</CardTitle>
            <CreditCard className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₦12,450,000</div>
            <p className="text-xs text-accent flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-white/5 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Loan Portfolio</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₦4,200,000</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              34 Active Loans
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Member Savings</CardTitle>
            <CreditCard className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₦8,250,000</div>
            <p className="text-xs text-accent flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> 150 members contributing
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            <AlertCircle className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">12</div>
            <p className="text-xs text-orange-400 flex items-center gap-1 mt-1">
              Awaiting Approval
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card/50 border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline font-bold">Contribution Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
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
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline font-bold">Recent Governance Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: 'Treasurer', action: 'Approved Loan #345', time: '2h ago', type: 'financial' },
                { user: 'President', action: 'Updated Auto-Debit Date to 28th', time: '5h ago', type: 'system' },
                { user: 'Auditor', action: 'Verified Q2 Financial Report', time: '1d ago', type: 'audit' },
                { user: 'System', action: 'Tokenization successful for 142 members', time: '1d ago', type: 'financial' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      item.type === 'financial' ? 'bg-accent' : item.type === 'audit' ? 'bg-blue-400' : 'bg-primary'
                    )} />
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">By {item.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
