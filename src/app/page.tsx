"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, TrendingUp, Users, Cpu, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { SystemSettings } from '@/lib/types';
import { motion } from 'framer-motion';

export default function Home() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'global') : null, [db]);
  const { data: settings, loading } = useDoc<SystemSettings>(settingsRef);

  const systemName = settings?.branding?.systemName || 'CoopNest';
  const logoUrl = settings?.branding?.logoUrl || '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-emerald-50/20">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      <header className="px-6 lg:px-12 h-20 flex items-center border-b border-emerald-100/40 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <Link className="flex items-center justify-center gap-3 group" href="/">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-6 h-6 rounded" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="text-2xl font-headline font-black tracking-tighter text-emerald-950">{systemName}</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Link className="hidden sm:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#features">Solutions</Link>
          <Button asChild variant="ghost" className="font-bold text-slate-600">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="rounded-full px-6 font-black bg-emerald-600 shadow-lg shadow-emerald-200">
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 relative z-10">
        <section className="w-full py-20 md:py-32 lg:py-48 flex items-center justify-center bg-gradient-to-b from-emerald-50/10 to-transparent">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-200"
              >
                <Sparkles className="w-3 h-3" /> Digital Cooperative Governance
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-headline font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-[900px] text-slate-900 leading-[1.1]">
                  Powering the Future of <span className="text-emerald-600">Community Wealth</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 font-medium md:text-xl leading-relaxed">
                  The unified command center for cooperative societies. Automated tokenization, transparent auditing, and secure loan management in one professional workspace.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="h-14 px-10 text-lg font-black rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-200 hover:scale-[1.02] transition-all">
                  <Link href="/login" className="flex items-center gap-2">
                    Enter Dashboard <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl border-emerald-100 bg-white hover:bg-emerald-50 text-emerald-700 transition-all shadow-md">
                  Request Demo
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 bg-emerald-100/30 border-y border-emerald-200/50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard 
                icon={TrendingUp} 
                title="Tokenized Savings" 
                description="Secure automated monthly debits via Paystack engine with bank-grade encryption."
                color="bg-emerald-500"
              />
              <FeatureCard 
                icon={ShieldCheck} 
                title="Multi-Role Auth" 
                description="Distinct interfaces for Presidents, Treasurers, Auditors and Members with strict RBAC."
                color="bg-slate-800"
              />
              <FeatureCard 
                icon={Cpu} 
                title="Dynamic Engines" 
                description="Configurable loan products with automated interest calculations and eligibility checks."
                color="bg-orange-500"
              />
              <FeatureCard 
                icon={Users} 
                title="Total Transparency" 
                description="Immutable audit trails and real-time financial reporting for absolute member trust."
                color="bg-blue-600"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 w-full px-6 md:px-12 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-emerald-50/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
             <ShieldCheck className="w-4 h-4 text-white" />
           </div>
           <span className="font-headline font-black text-lg text-emerald-950">{systemName}</span>
        </div>
        <p className="text-sm text-slate-400 font-medium">© 2025 {systemName} Governance Platform. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="text-xs font-bold text-slate-400 hover:text-emerald-600">Privacy Policy</Link>
          <Link href="#" className="text-xs font-bold text-slate-400 hover:text-emerald-600">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col p-8 rounded-[2rem] bg-white border border-emerald-100 shadow-2xl shadow-emerald-900/5 hover:shadow-emerald-200/60 transition-all duration-300"
    >
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-100/50`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-headline font-black mb-3 text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
}
