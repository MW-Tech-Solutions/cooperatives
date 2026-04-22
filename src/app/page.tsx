"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, TrendingUp, Users, Heart, Sparkles, ChevronRight, Gavel, Wallet } from 'lucide-react';
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
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <ShieldCheck className="w-10 h-10 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-emerald-50/20">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Sticky Transparent Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center border-b border-emerald-100/40 bg-white/60 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <Link className="flex items-center justify-center gap-3 group" href="/">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-6 h-6 rounded" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="text-2xl font-headline font-black tracking-tighter text-emerald-950">{systemName}</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Link className="hidden md:block text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors" href="#purpose">Our Purpose</Link>
          <Link className="hidden md:block text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors" href="#governance">Governance</Link>
          <Button asChild variant="ghost" className="font-bold text-slate-600 hover:bg-emerald-50">
            <Link href="/login">Portal Login</Link>
          </Button>
          <Button asChild className="rounded-full px-8 font-black bg-emerald-600 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
            <Link href="/login">Join Society</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 relative z-10">
        <section className="w-full py-24 md:py-40 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-10 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-200 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-emerald-600" /> Building Community Wealth
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <h1 className="text-5xl font-headline font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none max-w-[1000px] text-slate-900 leading-[1.05]">
                  Prosperity Through <span className="text-emerald-600">Collective Power</span>
                </h1>
                <p className="mx-auto max-w-[750px] text-slate-500 font-medium md:text-xl lg:text-2xl leading-relaxed">
                  Join a community dedicated to mutual growth. Our society simplifies savings, empowers members through transparent loans, and ensures every voice is heard in our shared governance.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <Button asChild size="lg" className="h-16 px-12 text-lg font-black rounded-2xl bg-emerald-600 shadow-2xl shadow-emerald-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Link href="/login" className="flex items-center gap-2">
                    Enter Member Portal <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 text-lg font-bold rounded-2xl border-emerald-100 bg-white/80 backdrop-blur-sm hover:bg-emerald-50 text-emerald-700 transition-all shadow-md">
                  View Bylaws
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="purpose" className="w-full py-28 bg-white border-y border-emerald-100/50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={TrendingUp} 
                title="Mutual Savings" 
                description="Harness the power of the pool. Small monthly contributions build a massive foundation for collective financial security."
                color="bg-emerald-500"
              />
              <FeatureCard 
                icon={Gavel} 
                title="Ethical Governance" 
                description="One member, one vote. Our leadership is transparent, audited, and strictly follows the society's democratically agreed constitution."
                color="bg-slate-800"
              />
              <FeatureCard 
                icon={Users} 
                title="Member Empowerment" 
                description="Access fair credit facilities based on your consistency. We prioritize members over profit, ensuring low-interest project funding."
                color="bg-orange-500"
              />
            </div>
          </div>
        </section>

        <section id="governance" className="w-full py-28 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-headline font-black text-slate-900">A Trusted Shield for Your Future</h2>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  We operate on the principles of trust and accountability. Every contribution is tracked, every loan is verified by peers, and every decision is logged for total transparency.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
                    Guaranteed Peer Accountability
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
                    Automated Disbursement Verification
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
                    Real-time Audit Trails
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-600/10 rounded-[3rem] blur-2xl group-hover:bg-emerald-600/20 transition-all"></div>
                  <img 
                    src="https://picsum.photos/seed/society/800/600" 
                    alt="Society Meeting" 
                    className="relative w-full rounded-[2.5rem] shadow-2xl border-4 border-white"
                    data-ai-hint="community people meeting"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 w-full px-6 md:px-12 border-t border-emerald-100/50 flex flex-col sm:flex-row items-center justify-between gap-8 bg-emerald-50/50 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
               <ShieldCheck className="w-4 h-4 text-white" />
             </div>
             <span className="font-headline font-black text-xl text-emerald-950">{systemName}</span>
          </div>
          <p className="text-sm text-slate-500 font-medium max-w-xs leading-relaxed">
            Empowering community growth through transparent and secure cooperative management.
          </p>
        </div>
        
        <div className="flex gap-12">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Resources</h4>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-600">Bylaws</Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-600">Application</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Legal</h4>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-600">Privacy</Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-600">Terms</Link>
          </div>
        </div>
        
        <p className="text-sm text-slate-400 font-medium sm:ml-auto">© 2025 {systemName}. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="flex flex-col p-10 rounded-[2.5rem] bg-white border border-emerald-50 shadow-2xl shadow-emerald-900/5 hover:shadow-emerald-200/40 transition-all duration-500 group"
    >
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-headline font-black mb-4 text-slate-900">{title}</h3>
      <p className="text-base text-slate-500 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
}
