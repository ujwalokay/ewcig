import { MainLayout } from "@/components/layout/main-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PCGrid } from "@/components/dashboard/pc-grid";
import { Users, DollarSign, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import generatedImage from '@assets/generated_images/futuristic_gaming_cafe_interior_concept_art.png'

export default function Dashboard() {
  return (
    <MainLayout title="Command Center">
      <div className="space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Active Sessions" 
            value="28/40" 
            icon={Users} 
            trend="12% vs last hr" 
            trendUp={true}
          />
          <StatsCard 
            title="Today's Revenue" 
            value="$1,245.50" 
            icon={DollarSign} 
            trend="8% vs yesterday" 
            trendUp={true}
          />
          <StatsCard 
            title="Avg Session Time" 
            value="2h 14m" 
            icon={Clock} 
            description="Peak hours approaching"
          />
          <StatsCard 
            title="System Load" 
            value="98%" 
            icon={Zap} 
            trend="High Usage" 
            trendUp={false} // Warning color
          />
        </div>

        {/* Main Grid Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Left Column: PC Grid (Takes up 3 cols) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
               {/* Decorative background image blended in */}
               <div 
                  className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                  style={{ 
                    backgroundImage: `url(${generatedImage})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  }} 
                />
                
              <PCGrid />
            </div>

            {/* Game Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 h-64 flex flex-col">
                <h3 className="text-lg font-display font-semibold text-white mb-4">Top Games Playing</h3>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { name: "Valorant", count: 12, percent: 45 },
                    { name: "League of Legends", count: 8, percent: 30 },
                    { name: "Counter-Strike 2", count: 5, percent: 15 },
                    { name: "Dota 2", count: 3, percent: 10 },
                  ].map((game, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
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
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 h-64 flex flex-col">
                <h3 className="text-lg font-display font-semibold text-white mb-4">Hardware Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <Zap className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-400">PC-12 Overheating</p>
                      <p className="text-xs text-red-400/70">GPU temp reached 92°C</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/20">Check</Button>
                  </div>
                  
                   <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-yellow-400">PC-08 Maintenance Due</p>
                      <p className="text-xs text-yellow-400/70">Driver updates pending</p>
                    </div>
                     <Button size="sm" variant="outline" className="ml-auto h-7 text-xs border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20">Update</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Activity Feed */}
          <div className="bg-card/80 border border-border rounded-xl p-0 overflow-hidden flex flex-col h-full backdrop-blur-md">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <h3 className="font-display font-bold text-white">Live Activity</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {[
                { type: "login", user: "ProGamer99", msg: "logged into PC-05", time: "Just now", color: "text-emerald-400" },
                { type: "order", user: "Table 4", msg: "ordered Red Bull x2", time: "2m ago", color: "text-primary" },
                { type: "logout", user: "CasualDave", msg: "logged out from PC-22", time: "5m ago", color: "text-zinc-400" },
                { type: "system", user: "System", msg: "Backup completed", time: "12m ago", color: "text-blue-400" },
                { type: "login", user: "JinxMain", msg: "logged into PC-11", time: "15m ago", color: "text-emerald-400" },
                { type: "order", user: "PC-30", msg: "ordered Pizza Slice", time: "18m ago", color: "text-primary" },
                { type: "login", user: "ProGamer99", msg: "logged into PC-05", time: "Just now", color: "text-emerald-400" },
                { type: "order", user: "Table 4", msg: "ordered Red Bull x2", time: "2m ago", color: "text-primary" },
                { type: "logout", user: "CasualDave", msg: "logged out from PC-22", time: "5m ago", color: "text-zinc-400" },
                { type: "system", user: "System", msg: "Backup completed", time: "12m ago", color: "text-blue-400" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 relative pb-6 last:pb-0">
                  {i !== 9 && <div className="absolute left-2 top-5 bottom-0 w-px bg-white/10" />}
                  <div className={`mt-1 h-4 w-4 rounded-full border-2 border-background shrink-0 ${item.color.replace('text-', 'bg-')}`} />
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-bold">{item.user}</span> {item.msg}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/5 bg-white/5">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wide">
                VIEW ALL LOGS
              </Button>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
