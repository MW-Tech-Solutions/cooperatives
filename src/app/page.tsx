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
  Sparkles
} from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { SystemSettings } from '@/lib/types';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen flex items-center justify-center bg-emerald-50/50">
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
    <div className="flex flex-col min-h-screen relative bg-emerald-50/20">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* FIXED Header */}
      <header className={`fixed top-0 left-0 right-0 h-20 flex items-center px-6 lg:px-16 z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-emerald-100/50' : 'bg-transparent'
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
            <Link href="/register">Join Society</Link>
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
              <SheetHeader className="text-left border-b border-emerald-50 pb-4">
                <SheetTitle className="text-2xl font-black text-emerald-950">Menu Navigation</SheetTitle>
                <SheetDescription>Access society resources and member portal.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-12">
                <Link href="#purpose" className="text-xl font-black text-emerald-950">Our Purpose</Link>
                <Link href="#governance" className="text-xl font-black text-emerald-950">Governance</Link>
                <hr className="border-emerald-100" />
                <Button asChild className="h-14 rounded-2xl bg-emerald-600 font-black text-lg">
                  <Link href="/login">Member Login</Link>
                </Button>
                <Button asChild variant="outline" className="h-14 rounded-2xl border-emerald-200 font-bold">
                  <Link href="/register">Become a Member</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 pt-20 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-40 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-black uppercase tracking-[0.2em] border border-emerald-200 shadow-sm backdrop-blur-sm"
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
                  Empowering community growth through trust and shared success. Our society transforms individual contributions into a powerful engine for collective wealth.
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
                <Button variant="outline" size="lg" className="h-16 px-12 text-lg font-bold rounded-2xl border-emerald-200 bg-white/40 backdrop-blur-sm hover:bg-emerald-50 text-emerald-700 transition-all shadow-lg">
                  View Constitution
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section id="purpose" className="w-full py-32 bg-emerald-900/[0.02] border-y border-emerald-100/50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Society Principles</h2>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm">How we build our community wealth</p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <ValueCard 
                icon={TrendingUp} 
                title="Mutual Savings" 
                description="Small consistent monthly contributions build a solid foundation for your family's future."
                color="bg-emerald-500"
              />
              <ValueCard 
                icon={Gavel} 
                title="Ethical Governance" 
                description="Democratic leadership built on transparency. Every member has a voice and a vote."
                color="bg-slate-800"
              />
              <ValueCard 
                icon={Users} 
                title="Member First" 
                description="We prioritize community needs over profit, providing fair access to ethical credit facilities."
                color="bg-orange-500"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 w-full px-6 md:px-16 border-t border-emerald-100/50 bg-emerald-50/50 backdrop-blur-sm">
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
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Society</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Bylaws</Link></li>
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Constitution</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Legal</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Privacy</Link></li>
                  <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-emerald-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 {systemName}. All rights reserved.</p>
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
      className="flex flex-col p-10 rounded-[3rem] bg-white/80 border border-emerald-100 shadow-2xl shadow-emerald-900/5 hover:shadow-emerald-200/40 transition-all duration-500 group"
    >
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-headline font-black mb-4 text-slate-900">{title}</h3>
      <p className="text-base text-slate-600 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
}
