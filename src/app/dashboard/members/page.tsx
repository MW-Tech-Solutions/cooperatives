
"use client"

import { useState } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types';

export default function MemberDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const db = useFirestore();

  const membersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), orderBy('name', 'asc'));
  }, [db]);

  const { data: members, loading } = useCollection<User>(membersQuery);

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
                      <Button variant="ghost" size="sm">View Profile</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
