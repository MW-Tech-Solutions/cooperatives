
"use client"

import { useState, useEffect } from 'react';
import { collection, query, orderBy, doc, updateDoc, setDoc, addDoc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Filter, Loader2, CheckCircle2, User as UserIcon, Mail, Shield, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User, UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MemberDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [newMember, setNewMember] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'MEMBER',
    status: 'Active'
  });

  const db = useFirestore();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('coopnest_role') === 'PRESIDENT');
    }
  }, []);

  const membersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), orderBy('name', 'asc'));
  }, [db]);

  const { data: members, loading } = useCollection<User>(membersQuery);

  const handleAddMember = () => {
    if (!db || !newMember.name || !newMember.email) return;
    setIsAdding(true);

    const usersCol = collection(db, 'users');
    const memberId = `MB-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      ...newMember,
      memberId,
      joinDate: new Date().toISOString().split('T')[0],
      totalSavings: 0,
      status: 'Active'
    };

    addDoc(usersCol, payload)
      .then(() => {
        toast({ title: "Member Added", description: `${newMember.name} has been successfully registered.` });
        setIsAddModalOpen(false);
        setNewMember({ name: '', email: '', role: 'MEMBER', status: 'Active' });
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: usersCol.path,
          operation: 'create',
          requestResourceData: payload
        }));
      })
      .finally(() => setIsAdding(false));
  };

  const handleApprove = (member: User) => {
    if (!db) return;
    setProcessingId(member.id);
    
    const userRef = doc(db, 'users', member.id);
    const updateData = { status: 'Active' };

    updateDoc(userRef, updateData)
      .then(() => {
        const auditId = `audit-${Date.now()}`;
        const auditRef = doc(db, 'auditLogs', auditId);
        const auditData = {
          action: 'Member Approved',
          actor: 'President',
          actorRole: 'PRESIDENT' as UserRole,
          target: member.name,
          timestamp: new Date().toISOString(),
          status: 'VERIFIED'
        };

        setDoc(auditRef, auditData).catch(() => {});
        toast({ title: "Member Approved", description: `${member.name} can now access the portal.` });
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updateData
        }));
      })
      .finally(() => {
        setProcessingId(null);
      });
  };

  const filteredMembers = members?.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Society Directory</h1>
          <p className="text-muted-foreground">Manage and view all registered cooperative members.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20 bg-emerald-600 hover:bg-emerald-700 font-bold h-12 rounded-2xl px-6">
              <UserPlus className="w-5 h-5" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-slate-100 bg-white shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-headline text-slate-900">New Member Entry</DialogTitle>
              <DialogDescription className="font-medium text-slate-500">
                Manually register a member into the society directory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold ml-1 text-slate-700">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Kenneth Salihu" 
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-emerald-500"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold ml-1 text-slate-700">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="k.salihu@coop.com" 
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-emerald-500"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold ml-1 text-slate-700">Governance Role</Label>
                <Select 
                  onValueChange={(val) => setNewMember({...newMember, role: val as UserRole})}
                  defaultValue="MEMBER"
                >
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-xl">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 bg-white">
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="TREASURER">Treasurer</SelectItem>
                    <SelectItem value="SECRETARY_GENERAL">Secretary General</SelectItem>
                    <SelectItem value="AUDITOR">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddMember} 
                disabled={isAdding} 
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-200"
              >
                {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Registration'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Search by name, ID or email..." 
            className="pl-12 h-12 bg-white border-slate-100 rounded-2xl shadow-sm focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 border-slate-100 h-12 rounded-2xl font-bold bg-white text-slate-600">
          <Filter className="w-5 h-5" /> Filter
        </Button>
      </div>

      <Card className="rounded-[2.5rem] border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden min-h-[400px]">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
              <p className="text-sm font-bold text-slate-500 animate-pulse">Synchronizing directory...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="w-[300px] font-bold text-slate-900">Member</TableHead>
                  <TableHead className="font-bold text-slate-900">System ID</TableHead>
                  <TableHead className="font-bold text-slate-900">Governance Role</TableHead>
                  <TableHead className="font-bold text-slate-900">Joined</TableHead>
                  <TableHead className="font-bold text-slate-900">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-900">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers?.map((member) => (
                  <TableRow key={member.id} className="border-slate-100 hover:bg-emerald-50/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-100">
                          <AvatarImage src={`https://picsum.photos/seed/${member.id}/200/200`} />
                          <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-black text-slate-900">{member.name}</p>
                          <p className="text-xs font-medium text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-emerald-600">{member.memberId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase tracking-wider px-3">
                        {member.role?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-600">{member.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'}`} />
                        <span className="text-xs font-bold text-slate-700">{member.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin && member.status === 'Pending' && (
                          <Button 
                            size="sm" 
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-xl px-4"
                            disabled={processingId === member.id}
                            onClick={() => handleApprove(member)}
                          >
                            {processingId === member.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Approve
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 rounded-xl font-bold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsViewModalOpen(true);
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMembers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <UserIcon className="w-12 h-12 text-slate-200" />
                        <p className="text-slate-400 font-bold">No members found in the society directory.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Profile Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-slate-100 p-0 overflow-hidden bg-white shadow-2xl">
          {selectedMember && (
            <div className="space-y-0">
              <div className="bg-emerald-600 p-10 text-white relative">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl">
                    <AvatarImage src={`https://picsum.photos/seed/${selectedMember.id}/200/200`} />
                    <AvatarFallback className="text-3xl font-black bg-white/20">{selectedMember.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black font-headline tracking-tighter">{selectedMember.name}</h2>
                    <p className="text-emerald-50 font-bold opacity-90 uppercase tracking-[0.2em] text-xs">{selectedMember.role?.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="absolute top-10 right-10">
                   <Badge className={`h-8 px-4 rounded-full border-none font-black text-xs ${selectedMember.status === 'Active' ? 'bg-white text-emerald-700' : 'bg-orange-400 text-white'}`}>
                    {selectedMember.status.toUpperCase()}
                   </Badge>
                </div>
              </div>
              <div className="p-10 bg-white grid gap-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Shield className="w-3 h-3" /> System ID
                    </p>
                    <p className="text-lg font-black text-slate-900">{selectedMember.memberId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email Contact
                    </p>
                    <p className="text-sm font-bold text-slate-700 truncate">{selectedMember.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Member Since
                    </p>
                    <p className="text-lg font-black text-slate-900">{selectedMember.joinDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <CreditCard className="w-3 h-3" /> Total Savings
                    </p>
                    <p className="text-lg font-black text-emerald-600">₦{(selectedMember.totalSavings || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50" onClick={() => setIsViewModalOpen(false)}>
                    Close Profile Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
