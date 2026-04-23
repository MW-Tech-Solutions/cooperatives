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
  Sparkles,
  ArrowRight,
  Target,
  Handshake,
  PieChart,
  ShieldAlert,
  HelpCircle,
  Plus
} from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { SystemSettings } from '@/lib/types';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

      {/* Header */}
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

        <nav className="ml-auto hidden md:flex gap-8 items-center">
          <Link className="text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors" href="#mission">Our Mission</Link>
          <Link className="text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors" href="#governance">Governance</Link>
          <Link className="text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors" href="#impact">Impact</Link>
          <Button asChild variant="ghost" className="font-bold text-slate-700 hover:bg-emerald-50">
            <Link href="/login">Portal Login</Link>
          </Button>
          <Button asChild className="rounded-full px-8 font-black bg-emerald-600 shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95">
            <Link href="/register">Join Society</Link>
          </Button>
        </nav>

        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-emerald-950">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-xl border-emerald-100">
              <SheetHeader className="text-left border-b border-emerald-50 pb-4">
                <SheetTitle className="text-2xl font-black text-emerald-950">Society Menu</SheetTitle>
                <SheetDescription>Explore our mission and access your portal.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-12">
                <Link href="#mission" className="text-xl font-black text-emerald-950">Our Mission</Link>
                <Link href="#governance" className="text-xl font-black text-emerald-950">Governance</Link>
                <Link href="#impact" className="text-xl font-black text-emerald-950">Impact</Link>
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
                <Heart className="w-3.5 h-3.5 fill-emerald-600" /> Registered Cooperative Society
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
                  Join a community dedicated to mutual financial growth. We transform individual monthly contributions into a powerful, democratically managed engine for collective wealth and affordable credit.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center"
              >
                <Button asChild size="lg" className="h-16 px-12 text-lg font-black rounded-2xl bg-emerald-600 shadow-2xl shadow-emerald-200/50 hover:scale-[1.03] active:scale-[0.97] transition-all group">
                  <Link href="/register" className="flex items-center gap-2">
                    Join Today <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 text-lg font-bold rounded-2xl border-emerald-200 bg-white/40 backdrop-blur-sm hover:bg-emerald-50 text-emerald-700 transition-all shadow-lg">
                  View Bylaws
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="impact" className="w-full py-20 bg-emerald-950 text-white flex items-center justify-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-400 rounded-full blur-[120px]" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Active Members', value: '1,200+' },
                { label: 'Total Savings', value: '₦450M+' },
                { label: 'Loans Disbursed', value: '₦1.2B' },
                { label: 'Annual Dividends', value: '12.5%' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-4xl md:text-5xl font-black font-headline text-emerald-400">{stat.value}</h3>
                  <p className="text-emerald-100/70 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section id="mission" className="w-full py-32 bg-white flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest">
                  Our Philosophy
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                  Built on the Pillar of <span className="text-emerald-600">Mutual Cooperation</span>
                </h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Unlike traditional banking, our cooperative is owned and controlled by its members. Every kobo saved contributes to a shared pool that empowers members to achieve their dreams—whether it's home ownership, asset financing, or business expansion.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Handshake, title: 'Mutual Aid', desc: 'Supporting each other in times of need.' },
                    { icon: Target, title: 'Asset Growth', desc: 'Structured investment opportunities.' },
                    { icon: ShieldCheck, title: 'Safe Haven', desc: 'Secure and transparent fund management.' },
                    { icon: PieChart, title: 'Profit Sharing', desc: 'Fair distribution of annual surpluses.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <item.icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-200">
                  <img src="https://picsum.photos/seed/coop4/800/1000" alt="Cooperative Impact" className="w-full h-auto" />
                </div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-600 rounded-full blur-[80px] opacity-20" />
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* Governance Section */}
        <section id="governance" className="w-full py-32 bg-slate-50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Democratic Governance</h2>
              <p className="text-lg text-slate-600 font-medium">One Member, One Vote. Our society is governed by an elected board of members, ensuring that leadership is always accountable to the community.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { 
                  title: 'Transparency', 
                  icon: Gavel, 
                  desc: 'All financial reports and audit logs are accessible to members through our secure digital hub.',
                  color: 'bg-emerald-600'
                },
                { 
                  title: 'Equity', 
                  icon: Users, 
                  desc: 'Every member has an equal voice in major decisions, regardless of their savings volume.',
                  color: 'bg-slate-900'
                },
                { 
                  title: 'Integrity', 
                  icon: ShieldAlert, 
                  desc: 'Adherence to strict cooperative laws and internal bylaws designed to protect member assets.',
                  color: 'bg-orange-500'
                }
              ].map((card, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:translate-y-[-8px] transition-all duration-300">
                  <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-200`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{card.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-32 bg-white flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {[
                { 
                  q: "How do I become a member?", 
                  a: "Membership is open to all individuals who share our vision. Simply register on this portal, and our admin team will review your application. A minimum monthly contribution is required to keep your account active."
                },
                { 
                  q: "What is the minimum monthly contribution?", 
                  a: "The standard minimum is ₦10,000, though members are encouraged to save more to increase their credit eligibility multiplier."
                },
                { 
                  q: "How soon can I apply for a loan?", 
                  a: "New members typically qualify for loan facilities after 6 months of consistent monthly contributions. This ensures the sustainability of our collective pool."
                },
                { 
                  q: "What interest rates do you charge?", 
                  a: "Our rates are highly competitive and are determined by the annual general meeting. Currently, we offer rates between 5% and 8% depending on the loan product."
                },
                { 
                  q: "Are my savings secure?", 
                  a: "Yes. Our society is registered with relevant authorities and operates under strict financial oversight. All funds are managed through bank-grade security protocols."
                }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-slate-100 py-2">
                  <AccordionTrigger className="text-lg font-bold text-slate-800 hover:text-emerald-600 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 font-medium leading-relaxed pb-6 pt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-white text-center space-y-8 relative overflow-hidden shadow-2xl shadow-emerald-200">
              <div className="absolute top-0 right-0 opacity-10">
                <Sparkles className="w-64 h-64" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black font-headline">Ready to grow together?</h2>
              <p className="max-w-2xl mx-auto text-emerald-50 text-lg font-medium">
                Join the hundreds of members who have secured their financial future through CoopNest. Registration takes less than 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-16 px-12 text-lg font-black rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl">
                  <Link href="/register">Join the Society</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-12 text-lg font-bold rounded-2xl border-white/30 text-white hover:bg-white/10">
                  <Link href="/login">Portal Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 w-full px-6 md:px-16 border-t border-emerald-100/50 bg-emerald-50/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                   <ShieldCheck className="w-6 h-6 text-white" />
                 </div>
                 <span className="font-headline font-black text-2xl text-emerald-950">{systemName}</span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                Dedicated to the collective prosperity and financial empowerment of our community through ethical management and shared governance.
              </p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
                   <Users className="w-5 h-5" />
                 </div>
                 <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
                   <TrendingUp className="w-5 h-5" />
                 </div>
                 <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
                   <ShieldAlert className="w-5 h-5" />
                 </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Society Bylaws</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Constitution</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Audit Reports</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">AGM Minutes</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Governance</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Board of Directors</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Election Process</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-emerald-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 {systemName}. Building Wealth Together.</p>
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secured by Firestore</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Governance</span>
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
