import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AddMemberDialog } from "@/components/dialogs/add-member-dialog";
import { TopUpDialog } from "@/components/dialogs/top-up-dialog";

export default function Members() {
  const members = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Player_${i*842}`,
    realName: ["Alex Chen", "Sarah Jones", "Mike Ross", "Jessica Wu"][i % 4],
    tier: i % 3 === 0 ? "Gold" : i % 2 === 0 ? "Silver" : "Bronze",
    balance: `$${(Math.random() * 200).toFixed(2)}`,
    points: Math.floor(Math.random() * 5000),
    avatar: i
  }));

  const tierColors = {
    Gold: "bg-yellow-500/20 text-yellow-500 border-yellow-500/40",
    Silver: "bg-slate-300/20 text-slate-300 border-slate-300/40",
    Bronze: "bg-orange-700/20 text-orange-400 border-orange-700/40"
  };

  return (
    <MainLayout 
      title="Member Database" 
      actions={
        <AddMemberDialog />
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="bg-card border-border/50 hover:border-primary/50 transition-colors group">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-20 w-20 border-2 border-white/10 group-hover:border-primary transition-colors">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Badge className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${tierColors[member.tier as keyof typeof tierColors]}`}>
                  {member.tier}
                </Badge>
              </div>
              
              <h3 className="text-xl font-display font-bold text-white mb-1">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{member.realName}</p>
              
              <div className="grid grid-cols-2 gap-2 w-full mb-4">
                <div className="bg-white/5 rounded p-2">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-mono text-lg font-bold text-emerald-400">{member.balance}</p>
                </div>
                <div className="bg-white/5 rounded p-2">
                  <p className="text-xs text-muted-foreground">Points</p>
                  <p className="font-mono text-lg font-bold text-primary">{member.points}</p>
                </div>
              </div>
              
              <div className="flex gap-2 w-full">
                 <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5">Profile</Button>
                 <TopUpDialog />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
