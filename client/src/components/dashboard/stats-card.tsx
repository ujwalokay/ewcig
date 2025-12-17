import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, className, description }: StatsCardProps) {
  return (
    <div className={cn(
      "relative group",
      className
    )}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 rounded-xl opacity-30 group-hover:opacity-60 blur-sm transition-all duration-300" />
      
      <div className="relative bg-black/90 backdrop-blur-xl rounded-xl border border-purple-500/30 p-4 h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
          <Icon className="w-full h-full text-purple-400" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-violet-900/10 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-medium text-purple-300/70 uppercase tracking-widest">
              {title}
            </span>
            <div className="h-9 w-9 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Icon className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          
          <div className="text-3xl font-bold font-display tracking-tight text-white mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            {value}
          </div>
          
          {(trend || description) && (
            <p className="text-xs flex items-center gap-2">
              {trend && (
                <span className={cn(
                  "flex items-center font-medium",
                  trendUp ? "text-emerald-400" : "text-purple-400"
                )}>
                  {trendUp ? "↑" : "↓"} {trend}
                </span>
              )}
              {description && <span className="text-purple-300/60">{description}</span>}
            </p>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-purple-400/80 blur-sm" />
      </div>
    </div>
  );
}
