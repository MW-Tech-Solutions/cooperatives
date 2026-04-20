
"use client"

import { useState, useEffect } from 'react';
import { doc, setDoc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
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
  Lock,
  Key,
  Plus,
  Trash2,
  Percent,
  Calculator,
  Mail,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SystemSettings, LoanType, SmtpSettings, BrandingSettings } from '@/lib/types';

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

  const [form, setForm] = useState<Partial<SystemSettings>>({
    branding: { systemName: 'CoopNest', logoUrl: '' },
    smtp: { host: '', port: 587, user: '', pass: '', fromName: '', fromEmail: '' }
  });

  const [newLoanType, setNewLoanType] = useState<Partial<LoanType>>({
    name: '',
    interestRate: 5,
    interestType: 'FLAT',
    maxDurationMonths: 12,
    minSavingsMonths: 6,
    guarantorsRequired: 2
  });

  useEffect(() => {
    if (settingsData) {
      setForm(prev => ({ ...prev, ...settingsData }));
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
        toast({ title: "Configuration Deployed", description: "Society parameters updated in real-time." });
        logAudit('System Settings Updated', 'Global Config');
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: settingsRef.path, operation: 'update', requestResourceData: payload }));
      })
      .finally(() => setLoading(false));
  };

  const addLoanType = () => {
    if (!db || !settingsRef || !newLoanType.name) return;
    const typeToAdd = { ...newLoanType, id: `lt-${Date.now()}` };
    
    updateDoc(settingsRef, {
      loanTypes: arrayUnion(typeToAdd)
    }).then(() => {
      toast({ title: "Loan Type Created", description: `${typeToAdd.name} is now available for applications.` });
      setNewLoanType({ name: '', interestRate: 5, interestType: 'FLAT', maxDurationMonths: 12, minSavingsMonths: 6, guarantorsRequired: 2 });
      logAudit('New Loan Type Added', typeToAdd.name as string);
    });
  };

  const logAudit = (action: string, target: string) => {
    if (!db) return;
    const logId = `audit-${Date.now()}`;
    setDoc(doc(db, 'auditLogs', logId), {
      action,
      actor: 'President',
      actorRole: 'PRESIDENT',
      target,
      timestamp: new Date().toISOString(),
      status: 'VERIFIED'
    });
  };

  if (role !== 'PRESIDENT') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Lock className="w-16 h-16 text-primary animate-pulse" />
        <h2 className="text-2xl font-headline font-bold">Access Restricted</h2>
        <p className="text-muted-foreground text-center max-w-md">Only the Society President has authority to access the Command Center.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Command Center</h1>
          <p className="text-muted-foreground">Enterprise governance & financial configuration engine.</p>
        </div>
        <Button onClick={handleSave} disabled={loading || settingsLoading} className="gap-2 shadow-lg shadow-primary/20">
          {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Deploy Global Logic
        </Button>
      </div>

      <Tabs defaultValue="financials" className="space-y-6">
        <TabsList className="bg-card/50 border border-white/5 p-1 flex-wrap h-auto">
          <TabsTrigger value="branding" className="gap-2"><Palette className="w-4 h-4" /> Branding</TabsTrigger>
          <TabsTrigger value="financials" className="gap-2"><Calculator className="w-4 h-4" /> Financials</TabsTrigger>
          <TabsTrigger value="loans" className="gap-2"><Percent className="w-4 h-4" /> Loan Engine</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Mail className="w-4 h-4" /> Email Server</TabsTrigger>
          <TabsTrigger value="rails" className="gap-2"><Key className="w-4 h-4" /> Payment Rails</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>Society Identity</CardTitle>
              <CardDescription>Customize the name and logo of your cooperative.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>System Name</Label>
                <Input 
                  value={form.branding?.systemName || ''} 
                  onChange={(e) => setForm({...form, branding: { ...form.branding!, systemName: e.target.value }})} 
                  placeholder="e.g. CoopNest Professional" 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input 
                  value={form.branding?.logoUrl || ''} 
                  onChange={(e) => setForm({...form, branding: { ...form.branding!, logoUrl: e.target.value }})} 
                  placeholder="https://..." 
                  className="bg-white/5 border-white/10" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure outgoing mail server for guarantor notifications.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input 
                  value={form.smtp?.host || ''} 
                  onChange={(e) => setForm({...form, smtp: { ...form.smtp!, host: e.target.value }})} 
                  placeholder="smtp.mailgun.org" 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input 
                  type="number" 
                  value={form.smtp?.port || ''} 
                  onChange={(e) => setForm({...form, smtp: { ...form.smtp!, port: Number(e.target.value) }})} 
                  placeholder="587" 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>SMTP User</Label>
                <Input 
                  value={form.smtp?.user || ''} 
                  onChange={(e) => setForm({...form, smtp: { ...form.smtp!, user: e.target.value }})} 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>SMTP Password</Label>
                <Input 
                  type="password" 
                  value={form.smtp?.pass || ''} 
                  onChange={(e) => setForm({...form, smtp: { ...form.smtp!, pass: e.target.value }})} 
                  className="bg-white/5 border-white/10" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Core Contribution Logic</CardTitle>
                <CardDescription>Configure mandatory pool inflows.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Automated Tokenization</Label>
                    <p className="text-xs text-muted-foreground">Trigger recurring charges via Paystack engine.</p>
                  </div>
                  <Switch checked={form.isAutoDebitActive} onCheckedChange={(val) => setForm({...form, isAutoDebitActive: val})} />
                </div>
                <div className="space-y-2">
                  <Label>Min Monthly Contribution (₦)</Label>
                  <Input type="number" value={form.minMonthlyContribution || ''} onChange={(e) => setForm({...form, minMonthlyContribution: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Penalty (%)</Label>
                    <Input type="number" value={form.defaultPenaltyRate || ''} onChange={(e) => setForm({...form, defaultPenaltyRate: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Auto-Debit Day</Label>
                    <Input type="number" min="1" max="28" value={form.autoDebitDate || ''} onChange={(e) => setForm({...form, autoDebitDate: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Liquidity Management</CardTitle>
                <CardDescription>Risk parameters for the cooperative pool.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Total Pool Liquidity Target (₦)</Label>
                  <Input type="number" value={form.totalPoolLiquidity || ''} onChange={(e) => setForm({...form, totalPoolLiquidity: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Loan-to-Savings Multiplier (x)</Label>
                  <Input type="number" step="0.1" value={form.loanToSavingsMultiplier || ''} onChange={(e) => setForm({...form, loanToSavingsMultiplier: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                  <p className="text-[10px] text-muted-foreground">Calculates eligibility based on member savings history.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loans" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 bg-card/50 border-white/5 h-fit">
              <CardHeader><CardTitle className="text-lg font-bold">New Loan Definition</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Loan Name</Label>
                  <Input placeholder="e.g. Asset Financing" value={newLoanType.name} onChange={e => setNewLoanType({...newLoanType, name: e.target.value})} className="bg-white/5 border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rate (%)</Label>
                    <Input type="number" value={newLoanType.interestRate} onChange={e => setNewLoanType({...newLoanType, interestRate: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Guarantors Req.</Label>
                    <Input type="number" value={newLoanType.guarantorsRequired} onChange={e => setNewLoanType({...newLoanType, guarantorsRequired: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                  </div>
                </div>
                <Button onClick={addLoanType} className="w-full gap-2"><Plus className="w-4 h-4" /> Define Product</Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-card/50 border-white/5">
              <CardHeader><CardTitle className="text-lg font-bold">Active Loan Products</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {form.loanTypes?.map((type, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div>
                        <p className="font-bold">{type.name}</p>
                        <p className="text-xs text-muted-foreground">{type.interestRate}% {type.interestType} Interest • {type.guarantorsRequired} Guarantors Needed</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                  {(!form.loanTypes || form.loanTypes.length === 0) && <p className="text-sm text-center text-muted-foreground py-10">No loan products defined.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rails" className="space-y-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader><CardTitle>Paystack Integration</CardTitle><CardDescription>Keys for automated recurring billing.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Public Key</Label>
                <Input type="password" value={form.paystackPublicKey || ''} onChange={(e) => setForm({...form, paystackPublicKey: e.target.value})} placeholder="pk_live_..." className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Secret Key</Label>
                <Input type="password" value={form.paystackSecretKey || ''} onChange={(e) => setForm({...form, paystackSecretKey: e.target.value})} placeholder="sk_live_..." className="bg-white/5 border-white/10" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
