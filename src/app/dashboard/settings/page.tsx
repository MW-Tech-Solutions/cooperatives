
"use client"

import { useState, useEffect, useMemo } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Save, 
  RefreshCcw,
  Zap,
  Info,
  Lock,
  Key
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SystemSettings } from '@/lib/types';

export default function CommandCenter() {
  const { toast } = useToast();
  const db = useFirestore();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem('coopnest_role'));
  }, []);

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'global') : null, [db]);
  const { data: settingsData, loading: settingsLoading } = useDoc<SystemSettings>(settingsRef);

  const [form, setForm] = useState<Partial<SystemSettings>>({});

  useEffect(() => {
    if (settingsData) {
      setForm(settingsData);
    }
  }, [settingsData]);

  const handleSave = () => {
    if (!db || !settingsRef) return;
    setLoading(true);

    const payload = {
      ...form,
      updatedAt: serverTimestamp()
    };

    setDoc(settingsRef, payload, { merge: true })
      .then(() => {
        toast({
          title: "Configuration Deployed",
          description: "Society parameters updated in real-time.",
        });
        // Log to audit
        const logId = `audit-${Date.now()}`;
        setDoc(doc(db, 'auditLogs', logId), {
          action: 'System Settings Updated',
          actor: 'President',
          target: 'Global Config',
          timestamp: new Date().toISOString(),
          status: 'VERIFIED'
        });
      })
      .catch(async (e) => {
        const error = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update',
          requestResourceData: payload
        });
        errorEmitter.emit('permission-error', error);
      })
      .finally(() => setLoading(false));
  };

  if (role !== 'PRESIDENT') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Lock className="w-16 h-16 text-primary animate-pulse" />
        <h2 className="text-2xl font-headline font-bold">Access Restricted</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Only the Society President has authority to access the Command Center.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Command Center</h1>
          <p className="text-muted-foreground">Manage global cooperative parameters and financial rails.</p>
        </div>
        <Button onClick={handleSave} disabled={loading || settingsLoading} className="gap-2 shadow-lg shadow-primary/20">
          {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Deploy Configurations
        </Button>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="bg-card/50 border border-white/5 p-1">
          <TabsTrigger value="global" className="gap-2"><Settings className="w-4 h-4" /> Financial Rules</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2"><Key className="w-4 h-4" /> Payment Rails</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle className="font-headline font-bold text-lg">Contributions & Automation</CardTitle>
                <CardDescription>Configure mandate parameters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Auto-Debit Engine</Label>
                    <p className="text-xs text-muted-foreground">Toggle Paystack recurring mandates.</p>
                  </div>
                  <Switch 
                    checked={form.isAutoDebitActive} 
                    onCheckedChange={(val) => setForm({...form, isAutoDebitActive: val})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Minimum Monthly Contribution (₦)</Label>
                  <Input 
                    type="number" 
                    value={form.minMonthlyContribution || ''} 
                    onChange={(e) => setForm({...form, minMonthlyContribution: Number(e.target.value)})}
                    className="bg-white/5 border-white/10" 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Auto-Debit Billing Date</Label>
                  <Select 
                    value={form.autoDebitDate?.toString() || "28"} 
                    onValueChange={(val) => setForm({...form, autoDebitDate: Number(val)})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}th of month</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle className="font-headline font-bold text-lg">Risk & Multipliers</CardTitle>
                <CardDescription>Define leverage and penalty caps.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loan Multiplier (x)</Label>
                    <Input 
                      type="number" 
                      value={form.loanToSavingsMultiplier || ''} 
                      onChange={(e) => setForm({...form, loanToSavingsMultiplier: Number(e.target.value)})}
                      className="bg-white/5 border-white/10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Penalty (%)</Label>
                    <Input 
                      type="number" 
                      value={form.defaultPenaltyRate || ''} 
                      onChange={(e) => setForm({...form, defaultPenaltyRate: Number(e.target.value)})}
                      className="bg-white/5 border-white/10" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Emergency Loan Interest (%)</Label>
                  <Input 
                    type="number" 
                    value={form.emergencyLoanInterest || ''} 
                    onChange={(e) => setForm({...form, emergencyLoanInterest: Number(e.target.value)})}
                    className="bg-white/5 border-white/10" 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Eligibility Period (Months)</Label>
                  <Input 
                    type="number" 
                    value={form.loanEligibilityMonths || ''} 
                    onChange={(e) => setForm({...form, loanEligibilityMonths: Number(e.target.value)})}
                    className="bg-white/5 border-white/10" 
                  />
                  <p className="text-[10px] text-muted-foreground italic">Minimum contribution history required for loans.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="font-headline font-bold">Paystack API Keys</CardTitle>
              <CardDescription>Securely connect to your financial processor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <Label>Public Key</Label>
                  <Input 
                    type="password" 
                    value={form.paystackPublicKey || ''} 
                    onChange={(e) => setForm({...form, paystackPublicKey: e.target.value})}
                    placeholder="pk_live_..." 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input 
                    type="password" 
                    value={form.paystackSecretKey || ''} 
                    onChange={(e) => setForm({...form, paystackSecretKey: e.target.value})}
                    placeholder="sk_live_..." 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="p-4 bg-orange-400/5 border border-orange-400/20 rounded-xl flex gap-3">
                   <Zap className="w-5 h-5 text-orange-400 shrink-0" />
                   <p className="text-xs text-orange-400 leading-relaxed">
                     Never share your Secret Key. These keys are used to initialize Paystack inline popups and handle server-to-server tokenization requests.
                   </p>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
