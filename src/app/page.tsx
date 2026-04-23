
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
  Menu, 
  Sparkles,
  Target,
  ShieldAlert,
  HelpCircle,
  Plus,
  Coins,
  Scale,
  Building2,
  FileCheck2,
  Lock,
  Globe,
  Award
} from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { SystemSettings } from '@/lib/types';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const heroBgImage = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl || '/coins-glass-jar-money-saving-financial-concept.jpg';
  const governanceImg = PlaceHolderImages.find(img => img.id === 'governance-img')?.imageUrl || '/4515.jpg';

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
    <div className="flex flex-col min-h-screen relative">
      {/* Background Wallpaper */}
      <div className="fixed inset-0 -z-20 w-full h-full">
        <img 
          src={heroBgImage} 
          alt="Wallpaper" 
          className="w-full h-full object-cover"
          data-ai-hint="corporate background"
        />
        {/* Darkening Overlay for readability */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Glass transparent effect at the top of the wallpaper */}
      <div className="fixed top-0 left-0 right-0 h-64 bg-white/10 backdrop-blur-2xl -z-10 [mask-image:linear-gradient(to_bottom,black_20%,transparent)] pointer-events-none" />

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
          <Link className="text-sm font-bold text-emerald-900 hover:text-emerald-600 transition-colors" href="#mission">Our Mission</Link>
          <Link className="text-sm font-bold text-emerald-900 hover:text-emerald-600 transition-colors" href="#products">Services</Link>
          <Link className="text-sm font-bold text-emerald-900 hover:text-emerald-600 transition-colors" href="#governance">Governance</Link>
          <Button asChild variant="ghost" className="font-bold text-emerald-700 hover:bg-emerald-50">
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
                <Link href="#products" className="text-xl font-black text-emerald-950">Our Services</Link>
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

      <main className="flex-1 pt-4 relative z-10">
        <section className="w-full py-12 md:py-16 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/80 text-emerald-800 text-xs font-black uppercase tracking-[0.2em] border border-emerald-200 shadow-sm backdrop-blur-sm"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" /> Established Since 2018
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-8"
              >
                <h1 className="text-4xl font-headline font-black tracking-tighter sm:text-5xl md:text-5xl lg:text-5xl max-w-[1000px] text-slate-900 leading-tight">
                  Secure Your Future <br /><span className="text-emerald-600">Collective Prosperity</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-slate-700 font-bold md:text-xl lg:text-2xl leading-relaxed drop-shadow-sm">
                  Experience the power of mutual aid. We leverage collective savings to provide members with bank-grade financial security, affordable credit, and shared annual dividends.
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
                    Start Saving Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-12 text-lg font-bold rounded-2xl border-white text-white hover:bg-white hover:text-emerald-700 bg-emerald-950/20 backdrop-blur-sm transition-all">
                  <Link href="/login">Portal Login</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="impact" className="w-full py-20 bg-emerald-950/90 backdrop-blur-md text-white flex items-center justify-center overflow-hidden relative">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Active Members', value: '2,450+' },
                { label: 'Asset Base', value: '₦850M+' },
                { label: 'Loans Disbursed', value: '₦1.4B' },
                { label: 'Last Dividend', value: '14.2%' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-4xl md:text-5xl font-black font-headline text-emerald-400">{stat.value}</h3>
                  <p className="text-emerald-100/70 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="w-full py-32 bg-white/95 backdrop-blur-sm flex items-center justify-center border-t border-emerald-100">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">
                Member Services
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Financial Solutions for <span className="text-emerald-600">Every Stage</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium">Our products are designed to support your personal and professional milestones through ethical financial engineering.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  title: 'Thrift Savings', 
                  icon: Coins, 
                  desc: 'Regular monthly contributions that build your borrowing power and capital base.',
                  features: ['3x Loan Multiplier', 'Compound Dividends', 'Easy Liquidations']
                },
                { 
                  title: 'Asset Financing', 
                  icon: Building2, 
                  desc: 'Low-interest loans for land purchase, home construction, or business equipment.',
                  features: ['Up to 60 Months', 'Minimal Processing', 'Competitive Rates']
                },
                { 
                  title: 'Emergency Relief', 
                  icon: ShieldAlert, 
                  desc: 'Quick-access funds for health, family, or urgent personal needs.',
                  features: ['24hr Disbursement', 'Zero Collateral', 'Flexible Repayment']
                },
                { 
                  title: 'Mutual Health', 
                  icon: Heart, 
                  desc: 'Collaborative medical insurance scheme providing affordable care for all members.',
                  features: ['Family Coverage', 'Network of Clinics', 'Subsidized Premiums']
                }
              ].map((product, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 flex flex-col h-full group transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                    <product.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{product.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">{product.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Plus className="w-3.5 h-3.5 text-emerald-600" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full rounded-2xl border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-600 hover:text-white">Learn More</Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="governance" className="w-full py-32 bg-slate-50/95 backdrop-blur-sm flex items-center justify-center relative overflow-hidden border-y border-emerald-100">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="flex-1 space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                    Governance Model
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                    Transparency as our <br /><span className="text-emerald-600">Core Mandate</span>
                  </h2>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    Our society is governed by strict cooperative principles ensuring every member's voice is heard and every kobo is accounted for through immutable digital auditing.
                  </p>
                </div>
                
                <div className="space-y-8">
                  {[
                    { title: 'Democratic Control', desc: 'One member, one vote policy regardless of savings volume.', icon: Scale },
                    { title: 'Independent Auditing', desc: 'Quarterly financial reviews by external audit firms.', icon: FileCheck2 },
                    { title: 'Real-time Reporting', desc: 'Monitor society liquidity and your portfolio 24/7.', icon: TrendingUp },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{item.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-200 border-8 border-white">
                  <img src={governanceImg} alt="Governance Meeting" className="w-full h-auto" />
                  <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/90 backdrop-blur-md rounded-[2rem] border border-emerald-100 shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-black text-slate-900">Encrypted Governance</h4>
                    </div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">All board resolutions and voting records are cryptographically secured and archived for perpetual member access.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-32 bg-white/95 backdrop-blur-sm flex items-center justify-center border-b border-emerald-100">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="p-8 rounded-[2rem] bg-emerald-600 text-white shadow-xl shadow-emerald-200">
                      <Globe className="w-8 h-8 mb-6 opacity-80" />
                      <h4 className="text-xl font-black mb-2">Member Community</h4>
                      <p className="text-xs font-medium opacity-80">Connecting individuals across diverse professional sectors.</p>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                      <Target className="w-8 h-8 text-emerald-600 mb-6" />
                      <h4 className="text-xl font-black mb-2">Social Impact</h4>
                      <p className="text-xs font-medium text-slate-500">Funding community projects and educational scholarships.</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-8 rounded-[2rem] bg-orange-500 text-white shadow-xl shadow-orange-200">
                      <TrendingUp className="w-8 h-8 mb-6 opacity-80" />
                      <h4 className="text-xl font-black mb-2">Sustainable ROI</h4>
                      <p className="text-xs font-medium opacity-80">Consistent returns through ethical fund diversification.</p>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100">
                      <Users className="w-8 h-8 text-emerald-600 mb-6" />
                      <h4 className="text-xl font-black mb-2">AGM Hub</h4>
                      <p className="text-xs font-medium text-slate-500">A dedicated space for democratic deliberation and voting.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">
                  The Cooperative Edge
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  More than just a <br /><span className="text-emerald-600">Financial Pool</span>
                </h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  We are a social enterprise built on the belief that economic freedom is best achieved through shared commitment and mutual support. Our digital hub brings together modern technology and age-old cooperative values.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="px-6 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">Financial Literacy Training</div>
                  <div className="px-6 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">Welfare Support Schemes</div>
                  <div className="px-6 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">Investment Cooperatives</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-32 bg-slate-50/95 backdrop-blur-sm flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-4xl">
            <div className="flex flex-col items-center text-center gap-4 mb-16">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Member FAQ</h2>
              <p className="text-slate-500 font-medium">Everything you need to know about joining and flourishing in our society.</p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
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
                <AccordionItem key={i} value={`faq-${i}`} className="border border-slate-200 bg-white rounded-2xl px-8 overflow-hidden">
                  <AccordionTrigger className="text-lg font-bold text-slate-800 hover:text-emerald-600 hover:no-underline py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 font-medium leading-relaxed pb-8 pt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="w-full py-24 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="bg-emerald-600/90 backdrop-blur-md rounded-[3rem] p-12 md:p-24 text-white text-center space-y-10 relative overflow-hidden shadow-2xl shadow-emerald-200">
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <Sparkles className="w-[400px] h-[400px]" />
              </div>
              <div className="space-y-4 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">Join the Movement</h2>
                <p className="max-w-2xl mx-auto text-emerald-50 text-lg md:text-xl font-medium">
                  Thousands of members have already secured their financial future. Join us today and let's grow together.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <Button asChild size="lg" className="h-16 px-16 text-lg font-black rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <Link href="/register">Sign Up in 5 Minutes</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-16 text-lg font-bold rounded-2xl border-white text-white hover:bg-white hover:text-emerald-700 bg-transparent transition-all">
                  <Link href="/login">Access Portal</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 w-full px-6 md:px-16 border-t border-emerald-100/50 bg-emerald-50/90 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200">
                   <ShieldCheck className="w-7 h-7 text-white" />
                 </div>
                 <span className="font-headline font-black text-3xl text-emerald-950">{systemName}</span>
              </div>
              <p className="text-base text-slate-600 font-bold leading-relaxed max-w-sm">
                A democratically governed financial ecosystem dedicated to the economic empowerment and mutual prosperity of its members through collective strength and ethical management.
              </p>
              <div className="flex gap-4">
                 <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all cursor-pointer hover:shadow-lg">
                   <Users className="w-6 h-6" />
                 </div>
                 <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all cursor-pointer hover:shadow-lg">
                   <TrendingUp className="w-6 h-6" />
                 </div>
                 <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all cursor-pointer hover:shadow-lg">
                   <ShieldAlert className="w-6 h-6" />
                 </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Member Links</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Society Bylaws</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Loan Application Guide</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Audit Reports 2024</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Annual Meeting Minutes</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Governance</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Board of Directors</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Elections 2025</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Privacy & Data Security</Link></li>
                <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Terms of Membership</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-emerald-100/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 {systemName}. Mutual Prosperity Guaranteed.</p>
            <div className="flex items-center gap-8">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registered Cooperative</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">FSA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
