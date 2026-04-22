"use client"

import { useState, useEffect } from 'react';
import { collection, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Filter, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function MemberDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const db = useFirestore();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('coopnest_role') === 'PRESIDENT');
  }, []);

  const membersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), orderBy('name', 'asc'));
  }, [db]);

  const { data: members, loading } = useCollection<User>(membersQuery);

  const handleApprove = (member: User) => {
    if (!db) return;
    setProcessingId(member.id);
    
    const userRef = doc(db, 'users', member.id);
    const updateData = { status: 'Active' };

    updateDoc(userRef, updateData)
      .then(() => {
        // Log audit trail
        const auditId = `audit-${Date.now()}`;
        const auditRef = doc(db, 'auditLogs', auditId);
        const auditData = {
          action: 'Member Approved',
          actor: 'President',
          actorRole: 'PRESIDENT',
          target: member.name,
          timestamp: new Date().toISOString(),
          status: 'VERIFIED'
        };

        setDoc(auditRef, auditData)
          .catch(async (e) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: auditRef.path,
              operation: 'create',
              requestResourceData: auditData
            }));
          });

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
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, ID or email..." 
            className="pl-10 bg-white/5 border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 border-white/10">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <Card className="bg-card/50 border-white/5 shadow-xl min-h-[400px]">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Synchronizing directory...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[300px]">Member</TableHead>
                  <TableHead>System ID</TableHead>
                  <TableHead>Governance Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers?.map((member) => (
                  <TableRow key={member.id} className="border-white/5 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://picsum.photos/seed/${member.id}/200/200`} />
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{member.memberId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold">
                        {member.role?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{member.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-accent' : 'bg-orange-400'}`} />
                        <span className="text-xs">{member.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdmin && member.status === 'Pending' ? (
                        <Button 
                          size="sm" 
                          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                          disabled={processingId === member.id}
                          onClick={() => handleApprove(member)}
                        >
                          {processingId === member.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Approve
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">View Profile</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMembers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                      No members found in the society directory.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
