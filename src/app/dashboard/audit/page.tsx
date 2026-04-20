"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldCheck, AlertCircle, SearchCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const logs = [
  { id: 'EV-102', action: 'Disbursement Approved', target: 'L-880', actor: 'Treasurer', time: '10:45 AM', status: 'VERIFIED' },
  { id: 'EV-101', action: 'Bylaws Updated', target: 'Governance', actor: 'President', time: '09:30 AM', status: 'VERIFIED' },
  { id: 'EV-100', action: 'Login Attempt', target: 'Admin Portal', actor: 'Unknown IP', time: '08:15 AM', status: 'FLAGGED' },
  { id: 'EV-099', action: 'Auto-Debit Success', target: '142 Members', actor: 'System Engine', time: 'Yesterday', status: 'VERIFIED' },
];

export default function AuditCenter() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Audit Intelligence</h1>
          <p className="text-muted-foreground">Immutable logs and system verification records.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Download Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-emerald-500/5 border-emerald-500/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">System Integrity</CardTitle>
              <CardDescription className="text-emerald-400/70">Blockchain-verified records.</CardDescription>
            </div>
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">All financial records are verified and hashing matches global state.</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">Pending Alerts</CardTitle>
              <CardDescription className="text-orange-400/70">Unverified access attempts.</CardDescription>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">3 events require manual verification from the Auditor role.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline font-bold">Activity Trail</CardTitle>
              <CardDescription>Real-time system event log.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search trail..." className="pl-9 h-9 bg-white/5 border-white/10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead>Event Code</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-white/5">
                  <TableCell className="font-mono text-xs">{log.id}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-[10px] text-muted-foreground">{log.target}</p>
                  </TableCell>
                  <TableCell className="text-sm">{log.actor}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.time}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={log.status === 'VERIFIED' ? 'bg-accent/20 text-accent' : 'bg-orange-400/20 text-orange-400'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}