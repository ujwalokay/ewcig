import { cn } from "@/lib/utils";
import { Monitor, Clock, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Terminal } from "@shared/schema";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type PCStatus = "Available" | "Occupied" | "Maintenance" | "Offline";

export function PCGrid() {
  const [filter, setFilter] = useState<PCStatus | "all">("all");

  const { data: terminals, isLoading } = useQuery<Terminal[]>({
    queryKey: ["/api/terminals"],
  });

  const statusColors: Record<string, string> = {
    Available: "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    Occupied: "bg-primary/10 border-primary/50 text-primary shadow-[0_0_10px_rgba(255,107,0,0.1)]",
    Maintenance: "bg-yellow-500/10 border-yellow-500/50 text-yellow-500",
    Offline: "bg-zinc-800/50 border-zinc-700 text-zinc-500",
  };

  const filteredTerminals = filter === "all" 
    ? terminals 
    : terminals?.filter(t => t.status === filter);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          Terminal Map
        </h3>
        
        <div className="flex gap-2 p-1 bg-card border border-border rounded-lg flex-wrap">
          {(["all", "Available", "Occupied", "Maintenance"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-all uppercase tracking-wider",
                filter === s 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground"
              )}
              data-testid={`button-filter-${s.toLowerCase()}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {(!terminals || terminals.length === 0) ? (
        <div className="text-center py-12 text-muted-foreground">
          No terminals configured yet. Seed the database to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredTerminals?.map((pc) => (
            <HoverCard key={pc.id}>
              <HoverCardTrigger asChild>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group",
                    statusColors[pc.status] || statusColors.Offline
                  )}
                  data-testid={`pc-grid-item-${pc.id}`}
                >
                  <div className={cn(
                    "absolute top-2 right-2 w-1.5 h-1.5 rounded-full",
                    pc.status === "Available" ? "bg-emerald-500 animate-pulse" :
                    pc.status === "Occupied" ? "bg-primary" :
                    pc.status === "Maintenance" ? "bg-yellow-500" : "bg-zinc-600"
                  )} />

                  <Monitor className="h-6 w-6 mb-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-display font-bold text-sm tracking-wide">{pc.name}</span>
                </motion.div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-card border-border/50 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
                <div className="h-2 bg-gradient-to-r from-primary to-orange-600" />
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-display font-bold text-xl text-white">{pc.name}</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{pc.specs || "N/A"}</p>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border shrink-0",
                      statusColors[pc.status] || statusColors.Offline
                    )}>
                      {pc.status}
                    </div>
                  </div>

                  {pc.status === "Occupied" && pc.currentUserId && (
                    <div className="space-y-3 bg-white/5 rounded-md p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Active User</p>
                          <p className="text-xs text-green-400">Member</p>
                        </div>
                      </div>
                      
                      {pc.currentGame && (
                        <div className="flex items-center justify-between text-sm border-t border-white/10 pt-2 gap-2">
                          <span className="text-muted-foreground">Playing:</span>
                          <span className="text-primary font-medium">{pc.currentGame}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {pc.status === "Available" && (
                    <div className="text-sm text-emerald-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Ready for login
                    </div>
                  )}
                  
                  {pc.status === "Maintenance" && (
                    <div className="text-sm text-yellow-500 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Scheduled maintenance
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">Zone: {pc.zone}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
    </div>
  );
}
