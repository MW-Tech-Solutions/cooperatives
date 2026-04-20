"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileText, Gavel, Users, Bell, Megaphone } from 'lucide-react';

export default function GovernanceModule() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Governance Control</h1>
          <p className="text-muted-foreground">Society bylaws, decision logs, and official announcements.</p>
        </div>
        <Button className="gap-2">
          <Megaphone className="w-4 h-4" /> Post Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Gavel className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="font-headline font-bold">Bylaws & Constitution</CardTitle>
            <CardDescription>The legal framework of CoopNest Society.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-white/10">
                <AccordionTrigger>Membership Eligibility</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Full membership is open to all staff and individuals who have completed the tokenization mandate of ₦10,000 monthly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-white/10">
                <AccordionTrigger>Loan Qualifications</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Members must have at least 6 months of consistent contributions to qualify for a loan multiplier of 3x.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-white/10">
                <AccordionTrigger>Voting Rights</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  One member, one vote. Elections are held biannually for the President and Secretary General roles.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <CardTitle className="font-headline font-bold">Latest Decisions</CardTitle>
            <CardDescription>Official board resolutions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Auto-Debit Adjustment', date: 'Feb 20, 2025', description: 'Moved to 28th of every month.' },
              { title: 'Interest Rate Cap', date: 'Jan 15, 2025', description: 'Reduced Emergency loan rates to 2%.' },
              { title: 'New Audit Cycle', date: 'Dec 01, 2024', description: 'Quarterly external auditing initiated.' },
            ].map((decision, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold">{decision.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{decision.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{decision.description}</p>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-primary h-8 mt-2">View Full Archive</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border border-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-headline">Annual General Meeting (AGM)</h3>
              <p className="text-sm text-muted-foreground">The next AGM is scheduled for June 15, 2025. All members are required to attend.</p>
            </div>
            <Button className="ml-auto">Add to Calendar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}