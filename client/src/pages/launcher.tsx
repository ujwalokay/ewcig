import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  Gamepad2, Clock, DollarSign, ShoppingCart, 
  LogOut, Bell, Wifi, Volume2, Search, Play, 
  Utensils, AlertTriangle, User, Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import generatedImage from '@assets/generated_images/futuristic_gaming_cafe_interior_concept_art.png';

// Mock Data
const games = [
  { id: 1, name: "Valorant", category: "FPS", image: "https://images.unsplash.com/photo-1624138784181-dc7f5b75e52d?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, name: "League of Legends", category: "MOBA", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, name: "Counter-Strike 2", category: "FPS", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, name: "Apex Legends", category: "Battle Royale", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, name: "Dota 2", category: "MOBA", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop" },
  { id: 6, name: "Fortnite", category: "Battle Royale", image: "https://images.unsplash.com/photo-1589241062272-c0a000071964?q=80&w=1000&auto=format&fit=crop" },
  { id: 7, name: "Minecraft", category: "Sandbox", image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1000&auto=format&fit=crop" },
  { id: 8, name: "Rocket League", category: "Sports", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop" },
];

const foodMenu = [
  { id: 1, name: "Red Bull", price: 4.50, image: "⚡" },
  { id: 2, name: "Pizza Slice", price: 3.00, image: "🍕" },
  { id: 3, name: "Nachos", price: 6.50, image: "🧀" },
  { id: 4, name: "Coke", price: 2.50, image: "🥤" },
];

export default function Launcher() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLocked, setIsLocked] = useState(false);
  const [sessionTime, setSessionTime] = useState(120); // Minutes remaining

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLaunch = (gameName: string) => {
    toast({
      title: "Launching Game",
      description: `Starting ${gameName}... Please wait.`,
    });
  };

  const handleOrder = (item: string) => {
    toast({
      title: "Order Placed",
      description: `${item} will be delivered to your terminal shortly.`,
    });
  };

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  if (isLocked) {
    return (
      <div className="h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center font-display">
        <div 
          className="absolute inset-0 opacity-40 blur-sm"
          style={{ 
            backgroundImage: `url(${generatedImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }} 
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        
        <div className="z-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="h-24 w-24 bg-primary rounded-xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,107,0,0.5)]">
             <Lock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-widest">TERMINAL LOCKED</h1>
          <p className="text-xl text-primary font-mono">Session Paused</p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-full"
            onClick={handleUnlock}
          >
            RESUME SESSION
          </Button>
        </div>
        
        <div className="absolute bottom-8 left-8 z-20 text-white/50 font-mono">
           PC-08 • GGCIRCUIT CLIENT v2.4
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col font-body selection:bg-primary/30">
      {/* Top Bar */}
      <header className="h-16 bg-card/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-white font-bold font-display skew-x-[-10deg]">G</div>
            <span className="font-display font-bold text-xl text-white tracking-widest hidden md:inline">GGCIRCUIT</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-white/80 font-mono text-sm">
             <Clock className="h-4 w-4 text-primary" />
             <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 bg-black/20 rounded-full px-4 py-1.5 border border-white/5">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Time Left</span>
                <span className="text-sm font-bold text-white font-mono leading-none">02:00:00</span>
             </div>
             <div className="h-8 w-px bg-white/10" />
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Balance</span>
                <span className="text-sm font-bold text-emerald-400 font-mono leading-none">$24.50</span>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
               <Volume2 className="h-5 w-5" />
             </Button>
             <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
               <Wifi className="h-5 w-5" />
             </Button>
             <Button 
                size="sm" 
                variant="destructive" 
                className="rounded-full px-4 font-bold tracking-wide"
                onClick={handleLock}
             >
               <Lock className="h-3 w-3 mr-2" /> LOCK
             </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <div className="w-20 bg-card border-r border-white/10 flex flex-col items-center py-6 gap-6 z-40">
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-primary/10 text-primary mb-4 shadow-[0_0_15px_rgba(255,107,0,0.3)]">
             <Gamepad2 className="h-6 w-6" />
           </Button>
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-white transition-all">
             <Utensils className="h-6 w-6" />
           </Button>
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-white transition-all">
             <ShoppingCart className="h-6 w-6" />
           </Button>
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-white transition-all">
             <User className="h-6 w-6" />
           </Button>
           <div className="flex-1" />
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-white transition-all">
             <AlertTriangle className="h-6 w-6" />
           </Button>
        </div>

        {/* Hero & Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-br from-background via-background to-black p-8 relative">
           
           {/* Ambient Background Effect */}
           <div className="absolute top-0 left-0 w-full h-[600px] bg-primary/5 blur-[150px] pointer-events-none" />

           {/* Hero Section */}
           <div className="relative h-[300px] rounded-2xl overflow-hidden mb-10 group border border-white/10 shadow-2xl">
              <div 
                className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url(${generatedImage})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                 <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded mb-2 uppercase tracking-wider">Featured Event</div>
                 <h2 className="text-4xl font-display font-bold text-white mb-2">Weekend Tournament</h2>
                 <p className="text-gray-300 max-w-xl mb-6">Join the server-wide 5v5 battle this Saturday. Prize pool includes 100 hours of game time and exclusive skins.</p>
                 <Button className="bg-white text-black hover:bg-gray-200 font-bold px-8">REGISTER NOW</Button>
              </div>
           </div>

           {/* Games Grid */}
           <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                 <Gamepad2 className="h-6 w-6 text-primary" />
                 Library
              </h3>
              <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Find a game..." className="pl-9 bg-white/5 border-white/10 rounded-full focus:border-primary/50" />
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {games.map((game) => (
                <div 
                  key={game.id} 
                  className="group relative aspect-[3/4] bg-card rounded-xl overflow-hidden border border-white/5 shadow-lg hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,107,0,0.2)] transition-all cursor-pointer"
                  onClick={() => handleLaunch(game.name)}
                >
                   {/* Placeholder Image Gradient since we don't have real covers for all */}
                   <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-110 transition-transform duration-500">
                      {/* Would be real image here */}
                      <div className="flex items-center justify-center h-full text-white/5 font-display font-bold text-4xl rotate-12 uppercase">
                        {game.category}
                      </div>
                   </div>
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                   
                   <div className="absolute bottom-0 left-0 p-4 w-full">
                      <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">{game.category}</p>
                      <h4 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{game.name}</h4>
                   </div>

                   {/* Hover Play Button */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                      <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                         <Play className="h-8 w-8 text-white ml-1" fill="white" />
                      </div>
                   </div>
                </div>
              ))}
           </div>
           
           {/* Quick Food Order Strip */}
           <div className="mt-12 mb-6">
              <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                 <Utensils className="h-5 w-5 text-primary" />
                 Fuel Up
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {foodMenu.map((item) => (
                   <div 
                      key={item.id} 
                      className="bg-card/50 border border-white/5 rounded-lg p-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors group"
                      onClick={() => handleOrder(item.name)}
                    >
                      <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-xl">
                         {item.image}
                      </div>
                      <div className="flex-1">
                         <p className="text-white font-bold text-sm group-hover:text-primary transition-colors">{item.name}</p>
                         <p className="text-muted-foreground text-xs">${item.price.toFixed(2)}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                         <ShoppingCart className="h-4 w-4" />
                      </Button>
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
