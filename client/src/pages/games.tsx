import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gamepad2, Download, Play, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Games() {
  const games = [
    { name: "Valorant", category: "FPS", status: "Ready", update: null, players: 24, image: "bg-red-500/20" },
    { name: "League of Legends", category: "MOBA", status: "Ready", update: null, players: 18, image: "bg-blue-500/20" },
    { name: "Counter-Strike 2", category: "FPS", status: "Updating", update: 45, players: 0, image: "bg-yellow-500/20" },
    { name: "Apex Legends", category: "Battle Royale", status: "Ready", update: null, players: 12, image: "bg-orange-500/20" },
    { name: "Dota 2", category: "MOBA", status: "Maintenance", update: null, players: 0, image: "bg-red-900/20" },
    { name: "Overwatch 2", category: "FPS", status: "Ready", update: null, players: 8, image: "bg-gray-500/20" },
    { name: "Fortnite", category: "Battle Royale", status: "Ready", update: null, players: 15, image: "bg-purple-500/20" },
    { name: "Call of Duty: MW3", category: "FPS", status: "Updating", update: 12, players: 0, image: "bg-green-500/20" },
  ];

  return (
    <MainLayout 
      title="Game Library"
      actions={
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
          <RefreshCw className="h-4 w-4 mr-2" /> Check Updates
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game, i) => (
          <div key={i} className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-lg">
            {/* Game Cover Placeholder */}
            <div className={cn("h-48 w-full relative flex items-center justify-center", game.image)}>
              <Gamepad2 className="h-16 w-16 text-white/20" />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="backdrop-blur-md bg-black/40 text-white border-white/10">
                  {game.category}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                {game.status === "Updating" ? (
                  <Badge className="bg-yellow-500 text-black animate-pulse">Updating</Badge>
                ) : game.status === "Maintenance" ? (
                   <Badge className="bg-red-500 text-white">Down</Badge>
                ) : (
                  <Badge className="bg-emerald-500 text-white">Ready</Badge>
                )}
              </div>
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                 <Button className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 text-white p-0">
                    <Play className="h-6 w-6 ml-1" />
                 </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display font-bold text-lg text-white">{game.name}</h3>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                   <span className="text-primary font-bold">{game.players}</span> Playing
                </div>
              </div>

              {game.status === "Updating" ? (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Downloading patch...</span>
                    <span>{game.update}%</span>
                  </div>
                  <Progress value={game.update} className="h-1.5 bg-white/10" />
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                   <Button variant="ghost" size="sm" className="flex-1 bg-white/5 hover:bg-white/10 text-xs h-8">
                      Manage
                   </Button>
                   <Button variant="ghost" size="sm" className="bg-white/5 hover:bg-white/10 text-xs h-8 w-8 p-0">
                      <AlertCircle className="h-3 w-3" />
                   </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
