
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Heart, 
  ChevronRight, 
  Gavel, 
  Menu, 
  X,
  ArrowRight
} from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { SystemSettings } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export default function Home() {
  const db = useFirestore();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'global') : null, [db]);
  const { data: settings, loading } = useDoc<SystemSettings>(settingsRef);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const systemName = settings?.branding?.systemName || 'CoopNest';
  const logoUrl = settings?.branding?.logoUrl || '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50/30">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <ShieldCheck className="w-12 h-12 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative bg-emerald-50/10">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0px,_transparent_1px)] bg-[length:32px_32px]" />
      </div>

      {/* FIXED Header */}
      <header className={`fixed top-0 left-0 right-0 h-20 flex items-center px-6 lg:px-16 z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-emerald-100/50' : 'bg-transparent'
      }`}>
        <Link className="flex items-center gap-3 group" href="/">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-6 h-6 rounded" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="text-2xl font-headline font-black tracking-tighter text-emerald-950">{systemName}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="ml-auto hidden md:flex gap-8 items-center">
          <Link className="text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors" href="#purpose">Our Purpose</Link>
          <Link className="text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors" href="#governance">Governance</Link>
          <Button asChild variant="ghost" className="font-bold text-slate-700 hover:bg-emerald-50">
            <Link href="/login">Portal Login</Link>
          </Button>
          <Button asChild className="rounded-full px-8 font-black bg-emerald-600 shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95">
            <Link href="/login">Join Society</Link>
          </Button>
        </nav>

        {/* Mobile Nav Trigger */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-emerald-950">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-xl border-emerald-100">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Mobile navigation options for the society portal.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-12">
                <Link href="#purpose" className="text-xl font-black text-emerald-950">Our Purpose</Link>
                <Link href="#governance" className="text-xl font-black text-emerald-950">Governance</Link>
                <hr className="border-emerald-100" />
                <Button asChild className="h-14 rounded-2xl bg-emerald-600 font-black text-lg">
                  <Link href="/login">Member Login</Link>
                </Button>
                <Button asChild variant="outline" className="h-14 rounded-2xl border-emerald-200 font-bold">
                  <Link href="/login">Become a Member</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 pt-20 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-100/50 text-emerald-700 text-xs font-black uppercase tracking-[0.2em] border border-emerald-200 shadow-sm backdrop-blur-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-emerald-600" /> Built for Mutual Prosperity
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-8"
              >
                <h1 className="text-5xl font-headline font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl/none max-w-[1200px] text-slate-900 leading-[0.95]">
                  Prosperity Through <span className="text-emerald-600">Collective Power</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-slate-600 font-medium md:text-xl lg:text-2xl leading-relaxed">
                  Empowering community growth through trust and shared success. Our society transforms individual contributions into a powerful engine for community wealth and financial security.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center"
              >
                <Button asChild size="lg" className="h-16 px-12 text-lg font-black rounded-2xl bg-emerald-600 shadow-2xl shadow-emerald-200/50 hover:scale-[1.03] active:scale-[0.97] transition-all group">
                  <Link href="/login" className="flex items-center gap-2">
                    Enter Member Portal <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 text-lg font-bold rounded-2xl border-emerald-100 bg-white/60 backdrop-blur-sm hover:bg-emerald-50 text-emerald-700 transition-all shadow-lg">
                  Our Constitution
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section id="purpose" className="w-full py-32 bg-white/40 backdrop-blur-md border-y border-emerald-100/50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Society Principles</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">How we build our community wealth</p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <ValueCard 
                icon={TrendingUp} 
                title="Mutual Savings" 
                description="Small consistent monthly contributions build a solid foundation. We harness the power of the pool to secure our collective future."
                color="bg-emerald-500"
              />
              <ValueCard 
                icon={Gavel} 
                title="Ethical Governance" 
                description="Democratic leadership built on transparency. Every member has a voice, and every decision is guided by our shared constitution."
                color="bg-slate-800"
              />
              <ValueCard 
                icon={Users} 
                title="Member First" 
                description="We prioritize community needs over profit. Access fair, ethical credit facilities designed to empower your projects and dreams."
                color="bg-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section id="governance" className="w-full py-40 flex items-center justify-center overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="flex-1 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-5xl font-headline font-black text-slate-900 leading-tight">A Trusted Shield for Your Family's Future</h2>
                  <p className="text-slate-600 text-xl leading-relaxed font-medium">
                    We operate on the sacred principles of trust and accountability. Our society ensures that every kobo is tracked and every member is protected.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    "Peer Verification",
                    "Automated Audit",
                    "Fair Interest Rates",
                    "Transparent Loans",
                    "Secure Mandates",
                    "Community Support"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-800 font-black text-sm uppercase tracking-tighter bg-white/50 p-4 rounded-2xl border border-emerald-50 shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative group">
                <div className="absolute -inset-10 bg-emerald-600/10 rounded-[4rem] blur-[80px] group-hover:bg-emerald-600/20 transition-all duration-700" />
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <img 
                    src="https://picsum.photos/seed/coop_trust/800/600" 
                    alt="Community Trust" 
                    className="relative w-full rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(16,185,129,0.2)] border-8 border-white"
                    data-ai-hint="happy community meeting"
                  />
                  <div className="absolute -bottom-8 -right-8 bg-emerald-600 text-white p-8 rounded-[2rem] shadow-2xl hidden md:block">
                    <p className="text-4xl font-black">100%</p>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Transparent</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-32 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="bg-emerald-950 rounded-[3rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-emerald-950/20">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--primary)_0px,_transparent_1px)] bg-[length:20px_20px]" />
              <h2 className="text-4xl md:text-6xl font-black text-white relative z-10 leading-tight">Ready to Secure Your<br/>Financial Future?</h2>
              <p className="text-emerald-100/70 text-lg md:text-xl font-medium max-w-2xl mx-auto relative z-10">
                Join hundreds of members who are building a stronger, more prosperous community together. Your journey to mutual wealth starts today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <Button asChild className="h-16 px-12 text-lg font-black rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 transition-all">
                  <Link href="/login">Apply for Membership</Link>
                </Button>
                <Button asChild variant="outline" className="h-16 px-12 text-lg font-bold rounded-2xl border-emerald-500/30 text-emerald-100 bg-transparent hover:bg-white/5">
                  <Link href="#purpose">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 w-full px-6 md:px-16 border-t border-emerald-100/50 bg-emerald-50/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-16">
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                   <ShieldCheck className="w-6 h-6 text-white" />
                 </div>
                 <span className="font-headline font-black text-2xl text-emerald-950">{systemName}</span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Dedicated to the collective prosperity and financial empowerment of our community through ethical management and shared governance.
              </p>
              <div className="flex gap-4">
                {/* Social icons could go here */}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Society</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Bylaws</Link></li>
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Constitution</Link></li>
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Committees</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Resources</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Loan Guide</Link></li>
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Audit Logs</Link></li>
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Help Center</Link></li>
                </ul>
              </div>
              <div className="space-y-4 col-span-2 sm:col-span-1">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Legal</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Terms of Use</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-emerald-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 {systemName}. All rights reserved.</p>
            <div className="flex items-center gap-1.5 opacity-30">
              <Heart className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Mutual Success</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ValueCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="flex flex-col p-10 rounded-[3rem] bg-white border border-emerald-50 shadow-2xl shadow-emerald-900/5 hover:shadow-emerald-200/40 transition-all duration-500 group"
    >
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-headline font-black mb-4 text-slate-900">{title}</h3>
      <p className="text-base text-slate-600 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
}
