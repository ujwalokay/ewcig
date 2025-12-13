import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AddMemberDialog } from "@/components/dialogs/add-member-dialog";
import { TopUpDialog } from "@/components/dialogs/top-up-dialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Member } from "@shared/schema";

export default function Members() {
  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const tierColors = {
    Gold: "bg-yellow-500/20 text-yellow-500 border-yellow-500/40",
    Silver: "bg-slate-300/20 text-slate-300 border-slate-300/40",
    Bronze: "bg-orange-700/20 text-orange-400 border-orange-700/40",
    Platinum: "bg-purple-500/20 text-purple-400 border-purple-500/40"
  };

  if (isLoading) {
    return (
      <MainLayout title="Member Database" actions={<AddMemberDialog />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-card border-border/50">
              <CardContent className="p-6 flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Member Database" 
      actions={<AddMemberDialog />}
    >
      {members && members.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground mb-4">No members yet. Add your first member to get started.</p>
          <AddMemberDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members?.map((member) => (
            <Card key={member.id} className="bg-card border-border/50 hover:border-primary/50 transition-colors group" data-testid={`card-member-${member.id}`}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-20 w-20 border-2 border-white/10 group-hover:border-primary transition-colors">
                    <AvatarImage src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`} />
                    <AvatarFallback>{member.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Badge className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${tierColors[member.tier as keyof typeof tierColors]}`}>
                    {member.tier}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-display font-bold text-white mb-1" data-testid={`text-username-${member.id}`}>{member.username}</h3>
                <p className="text-sm text-muted-foreground mb-4">{member.realName}</p>
                
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                  <div className="bg-white/5 rounded p-2">
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="font-mono text-lg font-bold text-emerald-400" data-testid={`text-balance-${member.id}`}>${member.balance}</p>
                  </div>
                  <div className="bg-white/5 rounded p-2">
                    <p className="text-xs text-muted-foreground">Points</p>
                    <p className="font-mono text-lg font-bold text-primary" data-testid={`text-points-${member.id}`}>{member.points}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full">
                   <Button variant="outline" className="flex-1 border-white/10" data-testid={`button-profile-${member.id}`}>Profile</Button>
                   <TopUpDialog memberId={member.id} memberName={member.username} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
