import { cn } from "@/lib/utils";
import { Monitor, Clock, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type PCStatus = "available" | "occupied" | "maintenance" | "offline";

interface PCTerminal {
  id: number;
  name: string;
  status: PCStatus;
  user?: string;
  timeRemaining?: string;
  specs?: string;
  game?: string;
}

const terminals: PCTerminal[] = Array.from({ length: 40 }, (_, i) => {
  const r = Math.random();
  let status: PCStatus = "available";
  if (r > 0.6) status = "occupied";
  else if (r > 0.9) status = "offline";
  else if (r > 0.95) status = "maintenance";

  return {
    id: i + 1,
    name: `PC ${(i + 1)}`,
    status,
    user: status === "occupied" ? `Player_${Math.floor(Math.random() * 1000)}` : undefined,
    timeRemaining: status === "occupied" ? `${Math.floor(Math.random() * 120)}m` : undefined,
    specs: "RTX 4090 • i9-13900K • 64GB",
    game: status === "occupied" ? ["Valorant", "League of Legends", "CS2", "Dota 2"][Math.floor(Math.random() * 4)] : undefined
  };
});

export function PCGrid() {
  const [filter, setFilter] = useState<PCStatus | "all">("all");

  const statusColors = {
    available: "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    occupied: "bg-primary/10 border-primary/50 text-primary shadow-[0_0_10px_rgba(255,107,0,0.1)] hover:shadow-[0_0_15px_rgba(255,107,0,0.3)]",
    maintenance: "bg-yellow-500/10 border-yellow-500/50 text-yellow-500",
    offline: "bg-zinc-800/50 border-zinc-700 text-zinc-500",
  };

  const filteredTerminals = filter === "all" ? terminals : terminals.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          Terminal Map
        </h3>
        
        <div className="flex gap-2 p-1 bg-card border border-border rounded-lg">
          {(["all", "available", "occupied", "maintenance"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-all uppercase tracking-wider",
                filter === s 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredTerminals.map((pc) => (
          <HoverCard key={pc.id}>
            <HoverCardTrigger asChild>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group",
                  statusColors[pc.status]
                )}
              >
                {/* Status Indicator Dot */}
                <div className={cn(
                  "absolute top-2 right-2 w-1.5 h-1.5 rounded-full",
                  pc.status === "available" ? "bg-emerald-500 animate-pulse" :
                  pc.status === "occupied" ? "bg-primary" :
                  pc.status === "maintenance" ? "bg-yellow-500" : "bg-zinc-600"
                )} />

                <Monitor className="h-6 w-6 mb-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-display font-bold text-sm tracking-wide">{pc.name}</span>
                
                {pc.status === "occupied" && (
                  <div className="mt-1 text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-white/90 font-mono">
                    {pc.timeRemaining}
                  </div>
                )}
              </motion.div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-card border-border/50 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
              <div className="h-2 bg-gradient-to-r from-primary to-orange-600" />
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-display font-bold text-xl text-white">{pc.name}</h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{pc.specs}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border",
                    statusColors[pc.status].replace("shadow-[0_0_10px_rgba(16,185,129,0.1)]", "") // minimal hack to reuse colors
                  )}>
                    {pc.status}
                  </div>
                </div>

                {pc.status === "occupied" && (
                  <div className="space-y-3 bg-white/5 rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{pc.user}</p>
                        <p className="text-xs text-green-400">Member</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm border-t border-white/10 pt-2">
                      <span className="text-muted-foreground">Playing:</span>
                      <span className="text-primary font-medium">{pc.game}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time Left:</span>
                      <span className="text-white font-mono">{pc.timeRemaining}</span>
                    </div>
                  </div>
                )}

                {pc.status === "available" && (
                  <div className="text-sm text-emerald-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Ready for login
                  </div>
                )}
                
                {pc.status === "maintenance" && (
                  <div className="text-sm text-yellow-500 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Scheduled maintenance: Update
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
