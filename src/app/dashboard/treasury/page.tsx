"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileDown, 
  History,
  CheckCircle2,
  Clock
} from 'lucide-react';

const pendingLoans = [
  { id: 'L-882', member: 'Amina Bello', amount: '₦250,000', type: 'Emergency', date: '2h ago' },
  { id: 'L-881', member: 'John Doe', amount: '₦1,200,000', type: 'Project', date: '5h ago' },
];

export default function TreasuryManagement() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Treasury Operations</h1>
          <p className="text-muted-foreground">Monitor society cash flow and approve disbursements.</p>
        </div>
        <Button className="gap-2">
          <FileDown className="w-4 h-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Bank Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₦14,890,450</div>
            <p className="text-[10px] text-accent mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Updated 5m ago
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Projected Revenue (Mar)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₦1,500,000</div>
            <p className="text-[10px] text-muted-foreground mt-1">From 150 members</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Disbursements (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₦5,670,000</div>
            <p className="text-[10px] text-orange-400 mt-1 flex items-center gap-1">
              <ArrowDownLeft className="w-3 h-3" /> 24 Loans Disbursed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/50 border-white/5 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline font-bold">Pending Disbursements</CardTitle>
              <CardDescription>Awaiting Treasurer final approval.</CardDescription>
            </div>
            <Badge variant="outline" className="text-orange-400 border-orange-400/20">Awaiting Action</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5">
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingLoans.map((loan) => (
                  <TableRow key={loan.id} className="border-white/5">
                    <TableCell className="font-medium">{loan.member}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">{loan.type}</Badge>
                    </TableCell>
                    <TableCell className="font-bold">{loan.amount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{loan.date}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Reject</Button>
                      <Button size="sm">Disburse</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline font-bold">Financial Health</CardTitle>
            <CardDescription>Risk assessment metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Liquidity Ratio</p>
                <p className="text-xs text-muted-foreground">System requirement: {'>'}1.5</p>
              </div>
              <div className="text-xl font-bold text-accent">2.4</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Default Rate</p>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </div>
              <div className="text-xl font-bold text-primary">0.8%</div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <Button variant="outline" className="w-full gap-2 text-xs h-8">
                <History className="w-3 h-3" /> Audit Log
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}