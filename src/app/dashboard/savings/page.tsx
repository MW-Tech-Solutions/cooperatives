
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  History, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MemberSavings() {
  const { toast } = useToast();
  const [showMandateForm, setShowMandateForm] = useState(false);
  const [mandateSuccess, setMandateSuccess] = useState(false);

  const handleLinkCard = () => {
    // Simulation of Paystack Tokenization flow
    setShowMandateForm(true);
    setTimeout(() => {
      setMandateSuccess(true);
      toast({
        title: "Mandate Created Successfully",
        description: "Your monthly contribution of ₦10,000 will be debited on the 28th.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Personal Wealth</h1>
          <p className="text-muted-foreground">Your contribution history and mandate settings.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="gap-2">
            <History className="w-4 h-4" /> Download Statement
           </Button>
           {!mandateSuccess && (
             <Button onClick={handleLinkCard} className="gap-2 shadow-lg shadow-primary/20">
              <CreditCard className="w-4 h-4" /> Setup Auto-Debit
             </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-card/50 border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Wallet className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Accumulated Savings</CardTitle>
            <div className="text-4xl font-bold font-headline mt-2">₦450,000.00</div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-medium">
                 <span className="text-muted-foreground">Savings Goal: House Project</span>
                 <span className="text-accent">45% Complete</span>
               </div>
               <Progress value={45} className="h-2 bg-white/5" />
             </div>
             <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                 <p className="text-xs text-muted-foreground mb-1">Monthly Mandate</p>
                 <p className="text-lg font-bold">₦10,000</p>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                 <p className="text-xs text-muted-foreground mb-1">Last Contribution</p>
                 <p className="text-lg font-bold">Jan 28, 2025</p>
               </div>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 shadow-xl flex flex-col justify-between">
          <CardHeader>
             <CardTitle className="font-headline font-bold text-lg">Payment Mandate</CardTitle>
             <CardDescription>Secure tokenization via Paystack.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center space-y-4">
            {mandateSuccess ? (
              <>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-accent" />
                </div>
                <div className="text-center">
                  <p className="font-bold">Active Mandate</p>
                  <p className="text-xs text-muted-foreground">Visa Ending in 4242</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Verified</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No mandate linked. Recurring contributions are currently manual.</p>
                </div>
                <Button onClick={handleLinkCard} variant="secondary" className="w-full">Link Card Now</Button>
              </>
            )}
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-4">
             <p className="text-[10px] text-muted-foreground text-center w-full italic">
               *Payments are secured using AES-256 bank-grade encryption.
             </p>
          </CardFooter>
        </Card>
      </div>

      <Card className="bg-card/50 border-white/5 shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline font-bold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'Monthly Contribution', amount: '₦10,000', date: 'Jan 28, 2025', status: 'SUCCESS' },
              { type: 'Monthly Contribution', amount: '₦10,000', date: 'Dec 28, 2024', status: 'SUCCESS' },
              { type: 'Special Levies', amount: '₦5,000', date: 'Nov 15, 2024', status: 'SUCCESS' },
              { type: 'Monthly Contribution', amount: '₦10,000', date: 'Oct 28, 2024', status: 'SUCCESS' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <ArrowUpRight className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">{tx.amount}</p>
                  <p className="text-[10px] font-bold tracking-tighter text-muted-foreground">CONFIRMED</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
