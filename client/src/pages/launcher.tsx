import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, Clock, DollarSign, ShoppingCart, 
  LogOut, Bell, Wifi, Volume2, Search, Play, 
  Utensils, AlertTriangle, User, Lock, Home,
  Trophy, Settings, HelpCircle, Gift, Users
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
  { id: 1, name: "Red Bull", price: 4.50, category: "Energy" },
  { id: 2, name: "Pizza Slice", price: 3.00, category: "Food" },
  { id: 3, name: "Nachos", price: 6.50, category: "Snacks" },
  { id: 4, name: "Coke", price: 2.50, category: "Drinks" },
  { id: 5, name: "Monster Energy", price: 4.00, category: "Energy" },
  { id: 6, name: "Hot Dog", price: 4.50, category: "Food" },
];

type ActiveTab = "home" | "games" | "food" | "rewards" | "tournaments" | "friends" | "profile" | "settings" | "help";

export default function Launcher() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLocked, setIsLocked] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [sessionTime] = useState(120);

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

  const sidebarItems = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "games" as const, icon: Gamepad2, label: "Game Library" },
    { id: "food" as const, icon: Utensils, label: "Food & Drinks" },
    { id: "rewards" as const, icon: Gift, label: "Rewards" },
    { id: "tournaments" as const, icon: Trophy, label: "Tournaments" },
    { id: "friends" as const, icon: Users, label: "Friends" },
  ];

  const bottomItems = [
    { id: "profile" as const, icon: User, label: "My Profile" },
    { id: "settings" as const, icon: Settings, label: "Settings" },
    { id: "help" as const, icon: HelpCircle, label: "Help & Support" },
  ];

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
            data-testid="button-resume-session"
          >
            RESUME SESSION
          </Button>
        </div>
        
        <div className="absolute bottom-8 left-8 z-20 text-white/50 font-mono">
           PC-08 | GGCIRCUIT CLIENT v2.4
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex font-body selection:bg-primary/30">
      
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-primary">
            <div className="h-8 w-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-display font-bold text-xl skew-x-[-10deg]">
              G
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-white">GGCIRCUIT</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/30">
              <AvatarImage src="https://i.pravatar.cc/150?u=gamer123" />
              <AvatarFallback className="bg-primary text-white">PG</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-white truncate">ProGamer_99</p>
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/40 text-xs">Gold Member</Badge>
            </div>
          </div>
          
          {/* Session Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-sidebar-accent/50 rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Time Left</p>
              <p className="text-lg font-mono font-bold text-white">02:00:00</p>
            </div>
            <div className="bg-sidebar-accent/50 rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Balance</p>
              <p className="text-lg font-mono font-bold text-emerald-400">$24.50</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </div>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              data-testid={`nav-${item.id}`}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden text-left",
                activeTab === item.id
                  ? "bg-sidebar-primary/10 text-primary font-medium"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
              )}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
              )}
              <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-primary" : "group-hover:text-white")} />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="mt-6 px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </div>
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              data-testid={`nav-${item.id}`}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden text-left",
                activeTab === item.id
                  ? "bg-sidebar-primary/10 text-primary font-medium"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
              )}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
              )}
              <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-primary" : "group-hover:text-white")} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button 
            variant="destructive" 
            className="w-full font-bold"
            onClick={handleLock}
            data-testid="button-lock-terminal"
          >
            <Lock className="h-4 w-4 mr-2" /> Lock Terminal
          </Button>
          <div className="flex items-center justify-center gap-4 py-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
              <Wifi className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
              {sidebarItems.find(i => i.id === activeTab)?.label || 
               bottomItems.find(i => i.id === activeTab)?.label || "Home"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 bg-white/5 border-white/10 rounded-full focus:border-primary/50"
                data-testid="input-search"
              />
            </div>
            <div className="flex items-center gap-2 text-white/80 font-mono text-sm bg-black/20 rounded-full px-4 py-2">
              <Clock className="h-4 w-4 text-primary" />
              <span data-testid="text-current-time">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-br from-background via-background to-black p-6 relative">
          {/* Ambient Background Effect */}
          <div className="absolute top-0 left-0 w-full h-[600px] bg-primary/5 blur-[150px] pointer-events-none" />
          
          <div className="relative z-10">
            {activeTab === "home" && <HomeContent onLaunch={handleLaunch} onOrder={handleOrder} />}
            {activeTab === "games" && <GamesContent onLaunch={handleLaunch} />}
            {activeTab === "food" && <FoodContent onOrder={handleOrder} />}
            {activeTab === "rewards" && <RewardsContent />}
            {activeTab === "tournaments" && <TournamentsContent />}
            {activeTab === "friends" && <FriendsContent />}
            {activeTab === "profile" && <ProfileContent />}
            {activeTab === "settings" && <SettingsContent />}
            {activeTab === "help" && <HelpContent />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Home Content
function HomeContent({ onLaunch, onOrder }: { onLaunch: (name: string) => void; onOrder: (name: string) => void }) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[280px] rounded-2xl overflow-hidden group border border-white/10 shadow-2xl">
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
          <Button className="bg-white text-black hover:bg-gray-200 font-bold px-8" data-testid="button-register-tournament">REGISTER NOW</Button>
        </div>
      </div>

      {/* Quick Access Games */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Recently Played
          </h3>
          <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm">View All</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.slice(0, 5).map((game) => (
            <div 
              key={game.id} 
              className="group relative aspect-[3/4] bg-card rounded-xl overflow-hidden border border-white/5 shadow-lg hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,107,0,0.2)] transition-all cursor-pointer"
              onClick={() => onLaunch(game.name)}
              data-testid={`card-game-${game.id}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-110 transition-transform duration-500">
                <div className="flex items-center justify-center h-full text-white/5 font-display font-bold text-3xl rotate-12 uppercase">
                  {game.category}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-3 w-full">
                <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">{game.category}</p>
                <h4 className="text-white font-bold text-sm leading-tight group-hover:text-primary transition-colors">{game.name}</h4>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                  <Play className="h-7 w-7 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Food Order */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            Quick Order
          </h3>
          <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm">Full Menu</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {foodMenu.slice(0, 4).map((item) => (
            <div 
              key={item.id} 
              className="bg-card/50 border border-white/5 rounded-lg p-4 hover:bg-white/5 cursor-pointer transition-colors group"
              onClick={() => onOrder(item.name)}
              data-testid={`card-food-${item.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-bold group-hover:text-primary transition-colors">{item.name}</p>
                <Badge variant="secondary" className="text-xs">{item.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-primary font-mono font-bold">${item.price.toFixed(2)}</p>
                <Button size="sm" variant="ghost" className="h-8 text-primary">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Games Content
function GamesContent({ onLaunch }: { onLaunch: (name: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button className="bg-primary text-white">All Games</Button>
        <Button variant="outline" className="border-white/10">FPS</Button>
        <Button variant="outline" className="border-white/10">MOBA</Button>
        <Button variant="outline" className="border-white/10">Battle Royale</Button>
        <Button variant="outline" className="border-white/10">Sports</Button>
        <Button variant="outline" className="border-white/10">Sandbox</Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="group relative aspect-[3/4] bg-card rounded-xl overflow-hidden border border-white/5 shadow-lg hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,107,0,0.2)] transition-all cursor-pointer"
            onClick={() => onLaunch(game.name)}
            data-testid={`card-game-library-${game.id}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-110 transition-transform duration-500">
              <div className="flex items-center justify-center h-full text-white/5 font-display font-bold text-4xl rotate-12 uppercase">
                {game.category}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">{game.category}</p>
              <h4 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{game.name}</h4>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                <Play className="h-8 w-8 text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Food Content
function FoodContent({ onOrder }: { onOrder: (name: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button className="bg-primary text-white">All Items</Button>
        <Button variant="outline" className="border-white/10">Energy</Button>
        <Button variant="outline" className="border-white/10">Drinks</Button>
        <Button variant="outline" className="border-white/10">Food</Button>
        <Button variant="outline" className="border-white/10">Snacks</Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foodMenu.map((item) => (
          <div 
            key={item.id} 
            className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 cursor-pointer transition-all group"
            onClick={() => onOrder(item.name)}
            data-testid={`card-menu-${item.id}`}
          >
            <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Utensils className="h-10 w-10 text-primary/80" />
            </div>
            <h3 className="font-bold text-white text-center mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
            <p className="text-sm text-muted-foreground text-center mb-3">{item.category}</p>
            <div className="flex items-center justify-between">
              <p className="text-primary font-mono font-bold text-lg">${item.price.toFixed(2)}</p>
              <Button size="sm" className="bg-white/5 hover:bg-primary hover:text-white">Add to Cart</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Rewards Content
function RewardsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white">Your Points</h3>
            <p className="text-muted-foreground">Earn points with every session and purchase</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-mono font-bold text-primary">2,450</p>
            <p className="text-sm text-muted-foreground">Available Points</p>
          </div>
        </div>
        <Progress value={65} className="h-2 bg-white/10" />
        <p className="text-sm text-muted-foreground mt-2">550 points until Gold status</p>
      </div>

      <h3 className="text-xl font-display font-bold text-white">Available Rewards</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "1 Hour Free Play", points: 500, icon: Clock },
          { name: "Free Energy Drink", points: 200, icon: Gift },
          { name: "VIP Booth Upgrade", points: 1000, icon: Trophy },
        ].map((reward, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all" data-testid={`card-reward-${i}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <reward.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-white">{reward.name}</h4>
                <p className="text-sm text-primary font-mono">{reward.points} points</p>
              </div>
            </div>
            <Button className="w-full bg-white/5 hover:bg-primary hover:text-white">Redeem</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tournaments Content
function TournamentsContent() {
  return (
    <div className="space-y-6">
      <div className="relative h-[200px] rounded-2xl overflow-hidden border border-white/10">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${generatedImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <Badge className="bg-primary mb-2">Live Now</Badge>
          <h2 className="text-2xl font-display font-bold text-white">Weekly Valorant Showdown</h2>
          <p className="text-gray-300">32 players competing for the grand prize</p>
        </div>
      </div>

      <h3 className="text-xl font-display font-bold text-white">Upcoming Events</h3>
      <div className="space-y-4">
        {[
          { name: "5v5 CS2 Tournament", date: "Saturday, Dec 16", prize: "$500", spots: "12/32" },
          { name: "Apex Legends Duo Cup", date: "Sunday, Dec 17", prize: "100 Hours", spots: "24/48" },
          { name: "League of Legends 1v1", date: "Monday, Dec 18", prize: "Exclusive Skin", spots: "8/16" },
        ].map((event, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between" data-testid={`card-tournament-${i}`}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-white">{event.name}</h4>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold">{event.prize}</p>
              <p className="text-sm text-muted-foreground">{event.spots} spots</p>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Join</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Friends Content
function FriendsContent() {
  const friends = [
    { name: "xXShadowHunterXx", status: "Playing Valorant", online: true },
    { name: "NightOwl_Gaming", status: "In Lobby", online: true },
    { name: "ProSniper2024", status: "Away", online: true },
    { name: "CasualGamer99", status: "Offline", online: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold text-white">Friends Online</h3>
        <Button variant="outline" className="border-primary text-primary">Add Friend</Button>
      </div>
      
      <div className="space-y-3">
        {friends.map((friend, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between" data-testid={`card-friend-${i}`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${friend.name}`} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
                  friend.online ? "bg-green-500" : "bg-gray-500"
                )} />
              </div>
              <div>
                <h4 className="font-bold text-white">{friend.name}</h4>
                <p className="text-sm text-muted-foreground">{friend.status}</p>
              </div>
            </div>
            {friend.online && (
              <Button variant="ghost" className="text-primary">Invite</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile Content
function ProfileContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <Avatar className="h-24 w-24 mx-auto border-4 border-primary/30 mb-4">
          <AvatarImage src="https://i.pravatar.cc/150?u=gamer123" />
          <AvatarFallback className="bg-primary text-white text-2xl">PG</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-display font-bold text-white">ProGamer_99</h2>
        <p className="text-muted-foreground">Member since January 2024</p>
        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/40 mt-2">Gold Member</Badge>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-sidebar-accent/50 rounded-lg p-3">
            <p className="text-2xl font-mono font-bold text-primary">156</p>
            <p className="text-xs text-muted-foreground">Hours Played</p>
          </div>
          <div className="bg-sidebar-accent/50 rounded-lg p-3">
            <p className="text-2xl font-mono font-bold text-primary">2,450</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          <div className="bg-sidebar-accent/50 rounded-lg p-3">
            <p className="text-2xl font-mono font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Tournaments</p>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-display font-bold text-white mb-4">Favorite Games</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Valorant</Badge>
          <Badge variant="secondary">CS2</Badge>
          <Badge variant="secondary">Apex Legends</Badge>
        </div>
      </div>
    </div>
  );
}

// Settings Content
function SettingsContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-display font-bold text-white mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Sound Effects</p>
              <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
            </div>
            <Button variant="outline" size="sm">On</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Auto-Launch Last Game</p>
              <p className="text-sm text-muted-foreground">Automatically start your last played game</p>
            </div>
            <Button variant="outline" size="sm">Off</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Help Content
function HelpContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-display font-bold text-white mb-4">Need Help?</h3>
        <p className="text-muted-foreground mb-4">Our staff is ready to assist you with any issues.</p>
        <Button className="bg-primary text-white">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Call for Assistance
        </Button>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-display font-bold text-white mb-4">FAQs</h3>
        <div className="space-y-4">
          <div>
            <p className="text-white font-medium">How do I add more time?</p>
            <p className="text-sm text-muted-foreground">Visit the front desk or use your account balance to extend your session.</p>
          </div>
          <div>
            <p className="text-white font-medium">How do I earn points?</p>
            <p className="text-sm text-muted-foreground">You earn 10 points for every $1 spent on time or purchases.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
