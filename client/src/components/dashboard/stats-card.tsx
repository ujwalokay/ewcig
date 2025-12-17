import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className={cn("bg-transparent border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden group backdrop-blur-sm", className)}>
      <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:opacity-25 transition-opacity">
        <Icon className="h-20 w-20 -mr-2 -mt-2 transform rotate-12 text-primary" />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-display tracking-tight text-white mb-1">{value}</div>
        {(trend || description) && (
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            {trend && (
              <span className={cn(
                "flex items-center font-medium",
                trendUp ? "text-emerald-400" : "text-primary"
              )}>
                {trendUp ? "↑" : "↓"} {trend}
              </span>
            )}
            {description && <span>{description}</span>}
          </p>
        )}
      </CardContent>
      
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
