"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCcw,
  Zap,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CommandCenter() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('coopnest_role');
    setRole(savedRole);
  }, []);

  if (role !== 'PRESIDENT') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Zap className="w-16 h-16 text-primary animate-pulse" />
        <h2 className="text-2xl font-headline font-bold">Access Restricted</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Only the Society President has authority to access the Dynamic Configuration Module.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "System Updated",
        description: "Global society parameters have been synchronized across all member portals.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Command Center</h1>
          <p className="text-muted-foreground">Manage global cooperative parameters and loan products.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="gap-2 shadow-lg shadow-primary/20">
          {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Deploy Configurations
        </Button>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="bg-card/50 border border-white/5 p-1">
          <TabsTrigger value="global" className="gap-2"><Settings className="w-4 h-4" /> Global Settings</TabsTrigger>
          <TabsTrigger value="loans" className="gap-2"><Plus className="w-4 h-4" /> Loan Products</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle className="font-headline font-bold text-lg">Auto-Debit Engine</CardTitle>
                <CardDescription>Configure recurring tokenized mandates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Enable Automation</Label>
                    <p className="text-xs text-muted-foreground">Trigger monthly auto-debits via Paystack.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label>Mandatory Contribution (₦)</Label>
                  <Input type="number" defaultValue="10000" className="bg-white/5 border-white/10" />
                  <p className="text-[10px] text-muted-foreground">This amount will be debited monthly from all active members.</p>
                </div>

                <div className="space-y-2">
                  <Label>Auto-Debit Date</Label>
                  <Select defaultValue="28">
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}th of the month</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle className="font-headline font-bold text-lg">Financial Multipliers</CardTitle>
                <CardDescription>Define risk and leverage parameters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Loan-to-Savings Multiplier</Label>
                  <Input type="number" defaultValue="3" className="bg-white/5 border-white/10" />
                  <p className="text-[10px] text-muted-foreground">Members can borrow up to this multiple of their total savings (e.g. 3x).</p>
                </div>

                <div className="space-y-2">
                  <Label>Default Penalty Rate (%)</Label>
                  <Input type="number" defaultValue="5" className="bg-white/5 border-white/10" />
                  <p className="text-[10px] text-muted-foreground">Applied to late repayments automatically.</p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-accent/10 border border-accent/20 rounded-xl mt-4">
                  <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-accent leading-relaxed">
                    Changes to these multipliers will only affect new loan applications. Existing loans will maintain their original contracted rates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loans" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline font-bold">Society Loan Portfolio</CardTitle>
                <CardDescription>Customized financial products for members.</CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Create Product
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Product Name</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Max Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'Emergency Loan', rate: '2%', method: 'FLAT', duration: '6 Months' },
                    { name: 'Project Loan', rate: '5%', method: 'REDUCING', duration: '24 Months' },
                    { name: 'Personal Loan', rate: '3.5%', method: 'FLAT', duration: '12 Months' },
                    { name: 'Business Growth', rate: '7%', method: 'REDUCING', duration: '36 Months' },
                  ].map((product, i) => (
                    <TableRow key={i} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.rate}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider",
                          product.method === 'FLAT' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                        )}>
                          {product.method}
                        </span>
                      </TableCell>
                      <TableCell>{product.duration}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
