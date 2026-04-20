
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('MEMBER');

  const handleLogin = () => {
    // In a real app, this would perform auth. For this prototype, 
    // we use localStorage to persist the selected role for the demo session.
    localStorage.setItem('coopnest_role', role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md border-white/10 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-bold">Welcome Back</CardTitle>
          <CardDescription>Select your governance role to enter the portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Governance Role</label>
            <Select onValueChange={(val) => setRole(val as UserRole)} defaultValue="MEMBER">
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRESIDENT">President / Admin</SelectItem>
                <SelectItem value="TREASURER">Treasurer (Accountant)</SelectItem>
                <SelectItem value="AUDITOR">Auditor</SelectItem>
                <SelectItem value="SECRETARY_GENERAL">Secretary General</SelectItem>
                <SelectItem value="ASSISTANT_PRESIDENT">Assistant President</SelectItem>
                <SelectItem value="MEMBER">Standard Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full h-11 text-lg font-headline font-semibold">
            Access Command Center
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
