import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Power, RotateCcw, Lock, Monitor, Cpu, Wifi } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Terminal } from "@shared/schema";
import { useState } from "react";

export default function Terminals() {
  const [filter, setFilter] = useState("");
  const [activeZone, setActiveZone] = useState("All Terminals");
  
  const { data: terminals, isLoading } = useQuery<Terminal[]>({
    queryKey: ["/api/terminals"],
  });

  const updateTerminalMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/terminals/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/terminals"] });
    }
  });

  const filteredTerminals = terminals?.filter(t => {
    const matchesFilter = t.name.toLowerCase().includes(filter.toLowerCase());
    const matchesZone = activeZone === "All Terminals" || t.zone === activeZone;
    return matchesFilter && matchesZone;
  });

  const zones = ["All Terminals", "VIP Room", "Main Floor", "Tournament Area"];

  if (isLoading) {
    return (
      <MainLayout title="Terminal Management">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Terminal Management" 
      actions={
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-red-500/50 text-red-400"
            data-testid="button-shutdown-all"
          >
            <Power className="h-4 w-4 mr-2" /> Shutdown All
          </Button>
          <Button className="bg-primary text-white" data-testid="button-wake-all">
            <Power className="h-4 w-4 mr-2" /> Wake All
          </Button>
        </div>
      }
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="bg-white/5 rounded-lg p-1 flex flex-wrap">
              {zones.map(zone => (
                <Button 
                  key={zone}
                  variant="ghost" 
                  size="sm" 
                  className={activeZone === zone ? "bg-primary/20 text-primary" : "text-muted-foreground"}
                  onClick={() => setActiveZone(zone)}
                  data-testid={`button-zone-${zone.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {zone}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Input 
               placeholder="Filter terminals..." 
               className="w-64 bg-background/50 border-white/10"
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               data-testid="input-filter-terminals"
             />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-[100px] text-white">ID</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Zone</TableHead>
              <TableHead className="text-white">Active App</TableHead>
              <TableHead className="text-white">Specs</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTerminals?.map((pc) => (
              <TableRow key={pc.id} className="border-white/5 hover:bg-white/5 transition-colors" data-testid={`row-terminal-${pc.id}`}>
                <TableCell className="font-mono font-medium text-primary">{pc.name}</TableCell>
                <TableCell>
                  <Badge className={
                    pc.status === "Available" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                    pc.status === "Occupied" ? "bg-primary/20 text-primary border-primary/20" :
                    pc.status === "Maintenance" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20" :
                    "bg-zinc-500/20 text-zinc-400 border-zinc-500/20"
                  }>
                    {pc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{pc.zone}</TableCell>
                <TableCell className="text-muted-foreground">{pc.currentGame || "-"}</TableCell>
                <TableCell>
                   <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> {pc.specs?.split(",")[0] || "N/A"}</span>
                   </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground"
                      data-testid={`button-monitor-${pc.id}`}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground"
                      data-testid={`button-lock-${pc.id}`}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => updateTerminalMutation.mutate({ id: pc.id, status: "Maintenance" })}
                      data-testid={`button-restart-${pc.id}`}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTerminals?.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No terminals found matching your filter.
          </div>
        )}
      </div>
    </MainLayout>
  );
}
