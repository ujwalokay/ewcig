import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Power, RotateCcw, Lock, Monitor, Cpu, Wifi } from "lucide-react";

export default function Terminals() {
  const terminals = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `PC-${(i + 1).toString().padStart(2, '0')}`,
    status: i % 4 === 0 ? "Occupied" : i % 5 === 0 ? "Offline" : "Available",
    user: i % 4 === 0 ? `User_${i*123}` : "-",
    uptime: i % 5 === 0 ? "-" : `${Math.floor(Math.random() * 48)}h`,
    temp: `${Math.floor(60 + Math.random() * 20)}°C`,
    ping: `${Math.floor(5 + Math.random() * 20)}ms`,
    game: i % 4 === 0 ? ["Valorant", "Apex Legends", "Fortnite"][i % 3] : "-"
  }));

  return (
    <MainLayout 
      title="Terminal Management" 
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
            <Power className="h-4 w-4 mr-2" /> Shutdown All
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Power className="h-4 w-4 mr-2" /> Wake All
          </Button>
        </div>
      }
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/5 rounded-lg p-1 flex">
              <Button variant="ghost" size="sm" className="bg-primary/20 text-primary">All Terminals</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">VIP Room</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">Tournament Area</Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Input placeholder="Filter terminals..." className="w-64 bg-background/50 border-white/10" />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-[100px] text-white">ID</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Current User</TableHead>
              <TableHead className="text-white">Active App</TableHead>
              <TableHead className="text-white">Health Stats</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {terminals.map((pc) => (
              <TableRow key={pc.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-mono font-medium text-primary">{pc.name}</TableCell>
                <TableCell>
                  <Badge className={
                    pc.status === "Available" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                    pc.status === "Occupied" ? "bg-primary/20 text-primary border-primary/20" :
                    "bg-zinc-500/20 text-zinc-400 border-zinc-500/20"
                  }>
                    {pc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-white font-medium">{pc.user}</TableCell>
                <TableCell className="text-muted-foreground">{pc.game}</TableCell>
                <TableCell>
                   <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> {pc.temp}</span>
                      <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> {pc.ping}</span>
                      <span className="flex items-center gap-1"><Monitor className="h-3 w-3" /> {pc.uptime}</span>
                   </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10">
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10">
                      <Lock className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
}
