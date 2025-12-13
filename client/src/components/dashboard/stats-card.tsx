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
    <Card className={cn("bg-card border-border/50 shadow-lg relative overflow-hidden group", className)}>
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="h-24 w-24 -mr-4 -mt-4 transform rotate-12" />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_10px_rgba(255,107,0,0.1)]">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-display tracking-tight text-white mb-1">{value}</div>
        {(trend || description) && (
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            {trend && (
              <span className={cn(
                "flex items-center font-medium",
                trendUp ? "text-green-500" : "text-red-500"
              )}>
                {trendUp ? "↑" : "↓"} {trend}
              </span>
            )}
            {description && <span>{description}</span>}
          </p>
        )}
      </CardContent>
      
      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
