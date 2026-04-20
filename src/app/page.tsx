
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, TrendingUp, Users, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-headline font-bold">CoopNest</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">Login</Link>
          <Button asChild size="sm">
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none max-w-[800px]">
                  Professional Governance for <span className="text-primary">Modern Cooperatives</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Automated financial management, secure recurring payments, and multi-role transparency for your society.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="px-8">
                  <Link href="/login">Join Your Society</Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 border border-white/5 bg-background p-6 rounded-2xl">
                <div className="p-3 bg-blue-500/10 rounded-full mb-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-bold">Smart Savings</h3>
                <p className="text-sm text-center text-muted-foreground">Automated tokenized contributions ensuring steady growth.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-white/5 bg-background p-6 rounded-2xl">
                <div className="p-3 bg-emerald-500/10 rounded-full mb-2">
                  <ShieldCheck className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-headline font-bold">RBAC Control</h3>
                <p className="text-sm text-center text-muted-foreground">Multi-tier governance for President, Treasurer, and Auditors.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-white/5 bg-background p-6 rounded-2xl">
                <div className="p-3 bg-purple-500/10 rounded-full mb-2">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-headline font-bold">Dynamic Engine</h3>
                <p className="text-sm text-center text-muted-foreground">Configurable loan types and interest rates at the touch of a button.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-white/5 bg-background p-6 rounded-2xl">
                <div className="p-3 bg-orange-500/10 rounded-full mb-2">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-headline font-bold">Transparency</h3>
                <p className="text-sm text-center text-muted-foreground">Real-time audit trails and financial reporting for all members.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/10 flex flex-col sm:row-reverse gap-4">
        <p className="text-xs text-muted-foreground">© 2025 CoopNest Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
