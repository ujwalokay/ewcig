import { MainLayout } from "@/components/layout/main-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PCGrid } from "@/components/dashboard/pc-grid";
import { Users, DollarSign, Clock, Zap, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityLog, Terminal } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import generatedImage from '@assets/generated_images/futuristic_gaming_cafe_interior_concept_art.png'

interface DashboardStats {
  activeSessions: number;
  totalTerminals: number;
  todayRevenue: string;
  topGames: { name: string; count: number; percent: number }[];
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: terminals } = useQuery<Terminal[]>({
    queryKey: ["/api/terminals"],
  });

  const { data: activityLogs } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
  });

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login": return "text-emerald-400";
      case "logout": return "text-zinc-400";
      case "topup": 
      case "order": return "text-primary";
      case "system": return "text-blue-400";
      default: return "text-white";
    }
  };

  const maintenanceTerminals = terminals?.filter(t => t.status === "Maintenance") || [];
  const offlineTerminals = terminals?.filter(t => t.status === "Offline") || [];

  return (
    <MainLayout title="Command Center">
      <div className="space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))
          ) : (
            <>
              <StatsCard 
                title="Active Sessions" 
                value={`${stats?.activeSessions || 0}/${stats?.totalTerminals || 0}`}
                icon={Users} 
                trend="Live count" 
                trendUp={true}
              />
              <StatsCard 
                title="Today's Revenue" 
                value={`$${stats?.todayRevenue || "0.00"}`}
                icon={DollarSign} 
                trend="Updated live" 
                trendUp={true}
              />
              <StatsCard 
                title="Available PCs" 
                value={`${(stats?.totalTerminals || 0) - (stats?.activeSessions || 0)}`}
                icon={Clock} 
                description="Ready for use"
              />
              <StatsCard 
                title="System Load" 
                value={stats?.totalTerminals ? `${Math.round((stats.activeSessions / stats.totalTerminals) * 100)}%` : "0%"}
                icon={Zap} 
                trend={(stats?.activeSessions || 0) > (stats?.totalTerminals || 1) * 0.8 ? "High Usage" : "Normal"} 
                trendUp={false}
              />
              <StatsCard 
                title="Account Balance" 
                value="$1,250.00"
                icon={Wallet} 
                trend="Available funds" 
                trendUp={true}
              />
            </>
          )}
        </div>

        {/* Main Grid Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Left Column: PC Grid (Takes up 3 cols) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-violet-600/20 to-purple-600/30 rounded-xl blur-sm" />
              <div className="relative bg-black/80 border border-purple-500/20 rounded-xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
                  style={{ 
                    backgroundImage: `url(${generatedImage})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  }} 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-violet-900/10 pointer-events-none" />
                <PCGrid />
              </div>
            </div>

            {/* Game Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-xl blur-sm opacity-50" />
                <div className="relative bg-black/80 border border-purple-500/20 rounded-xl p-6 h-64 flex flex-col backdrop-blur-xl">
                  <h3 className="text-lg font-display font-semibold text-white mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]">Top Games Playing</h3>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {stats?.topGames && stats.topGames.length > 0 ? (
                    stats.topGames.map((game, i) => (
                      <div key={i} className="space-y-1" data-testid={`game-stats-${i}`}>
                        <div className="flex justify-between text-sm gap-2">
                          <span className="font-medium text-white">{game.name}</span>
                          <span className="text-muted-foreground">{game.count} active</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${game.percent}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-purple-300/60 text-sm">No games currently being played</p>
                  )}
                </div>
              </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-xl blur-sm opacity-50" />
                <div className="relative bg-black/80 border border-purple-500/20 rounded-xl p-6 h-64 flex flex-col backdrop-blur-xl">
                  <h3 className="text-lg font-display font-semibold text-white mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]">Hardware Alerts</h3>
                <div className="space-y-3 overflow-y-auto">
                  {maintenanceTerminals.length > 0 || offlineTerminals.length > 0 ? (
                    <>
                      {maintenanceTerminals.slice(0, 2).map((terminal) => (
                        <div key={terminal.id} className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-yellow-400">{terminal.name} Maintenance Due</p>
                            <p className="text-xs text-yellow-400/70">Scheduled maintenance</p>
                          </div>
                          <Button size="sm" variant="outline" className="ml-auto h-7 text-xs border-yellow-500/30 text-yellow-400">Update</Button>
                        </div>
                      ))}
                      {offlineTerminals.slice(0, 2).map((terminal) => (
                        <div key={terminal.id} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <Zap className="h-5 w-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-400">{terminal.name} Offline</p>
                            <p className="text-xs text-red-400/70">Connection lost</p>
                          </div>
                          <Button size="sm" variant="outline" className="ml-auto h-7 text-xs border-red-500/30 text-red-400">Check</Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-purple-300/60 text-sm">All systems running normally</p>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Activity Feed */}
          <div className="relative group h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-600/30 via-violet-600/20 to-purple-600/30 rounded-xl blur-sm" />
            <div className="relative bg-black/80 border border-purple-500/20 rounded-xl p-0 overflow-hidden flex flex-col h-full backdrop-blur-xl">
              <div className="p-4 border-b border-purple-500/20 bg-purple-900/20">
                <h3 className="font-display font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">Live Activity</h3>
              </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.map((item, i) => (
                  <div key={item.id} className="flex gap-3 relative pb-6 last:pb-0" data-testid={`activity-log-${item.id}`}>
                    {i !== activityLogs.length - 1 && <div className="absolute left-2 top-5 bottom-0 w-px bg-white/10" />}
                    <div className={`mt-1 h-4 w-4 rounded-full border-2 border-background shrink-0 ${getActivityColor(item.type).replace('text-', 'bg-')}`} />
                    <div>
                      <p className="text-sm text-white">{item.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-purple-300/60 text-sm text-center">No recent activity</p>
              )}
            </div>
            <div className="p-4 border-t border-purple-500/20 bg-purple-900/20">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold tracking-wide border-0 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all" data-testid="button-view-all-logs">
                VIEW ALL LOGS
              </Button>
            </div>
          </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
