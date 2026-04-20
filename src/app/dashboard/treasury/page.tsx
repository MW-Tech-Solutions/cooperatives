"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileDown, 
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ledgerData = [
  { id: 'TX-101', member: 'Amina Bello', amount: 250000, type: 'LOAN_DISBURSEMENT', date: '2025-03-01', status: 'COMPLETED' },
  { id: 'TX-102', member: 'John Doe', amount: 10000, type: 'CONTRIBUTION', date: '2025-03-01', status: 'COMPLETED' },
  { id: 'TX-103', member: 'Sarah Okon', amount: 1200000, type: 'LOAN_DISBURSEMENT', date: '2025-02-28', status: 'PENDING' },
  { id: 'TX-104', member: 'David Kalu', amount: 10000, type: 'CONTRIBUTION', date: '2025-02-28', status: 'COMPLETED' },
  { id: 'TX-105', member: 'System', amount: 50000, type: 'ADMIN_FEE', date: '2025-02-27', status: 'COMPLETED' },
];

export default function TreasuryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredData = useMemo(() => {
    return ledgerData.filter(tx => {
      const matchesSearch = tx.member.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || tx.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Treasury_Ledger");
    XLSX.writeFile(wb, `CoopNest_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Treasury Intelligence</h1>
          <p className="text-muted-foreground font-medium">Automated double-entry ledger & disbursement control.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={exportToExcel} className="gap-2 flex-1 sm:flex-none glass-card">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none shadow-lg shadow-primary/20">
            <CreditCard className="w-4 h-4" /> Run Payouts
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Bank Liquidity" value="₦14,890,450" icon={ArrowUpRight} trend="+₦1.2M this month" />
        <StatCard title="Total Payouts" value="₦5,670,000" icon={ArrowDownLeft} variant="destructive" />
        <StatCard title="System Reserves" value="₦840,000" icon={CheckCircle2} />
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Master Ledger</CardTitle>
              <CardDescription>Verifiable history of all financial flows.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search ledger..." 
                  className="pl-10 h-10 bg-white/5 border-white/10 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-10 border-white/10">
                <Filter className="w-4 h-4 mr-2" /> Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/5">
                <TableHead className="font-bold">Transaction ID</TableHead>
                <TableHead className="font-bold">Entity/Member</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Execution Date</TableHead>
                <TableHead className="font-bold text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((tx) => (
                <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    {tx.id}
                  </TableCell>
                  <TableCell className="font-medium">{tx.member}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-bold tracking-widest bg-white/10">
                      {tx.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn("font-bold", tx.amount > 100000 ? "text-primary" : "text-foreground")}>
                    ₦{tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{tx.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {tx.status === 'PENDING' && <AlertTriangle className="w-3 h-3 text-orange-400" />}
                      <Badge className={tx.status === 'COMPLETED' ? 'bg-accent/20 text-accent border-accent/20' : 'bg-orange-400/20 text-orange-400 border-orange-400/20'}>
                        {tx.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                    No ledger entries matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, trend, variant }: { title: string, value: string, icon: any, trend?: string, variant?: 'default' | 'destructive' }) {
  return (
    <Card className="glass-card overflow-hidden relative group">
      <div className={cn("absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity", variant === 'destructive' ? 'bg-destructive' : 'bg-primary')} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-headline">{value}</div>
        {trend && (
          <p className={cn("text-[10px] font-bold mt-2", variant === 'destructive' ? 'text-destructive' : 'text-accent')}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
