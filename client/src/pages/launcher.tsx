import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTauriGames, type GameInfo } from "@/hooks/use-tauri-games";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Gamepad2, Clock, DollarSign, ShoppingCart, 
  LogOut, Bell, Wifi, Volume2, Search, Play, 
  Utensils, AlertTriangle, User, Lock, Home,
  Trophy, Settings, HelpCircle, Gift, Users, AppWindow,
  Chrome, Music, Video, FileText, Calculator, Camera, MessageSquare, Mail,
  X, Minus, Plus, Trash2, QrCode, Keyboard, ChevronRight,
  Crosshair, Sword, Target, Flame, Pickaxe, Car, Swords, Globe, Sparkles, type LucideIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { TimePackage, LauncherGame, LauncherFoodItem, LauncherTournament, LauncherReward, LauncherApp } from "@shared/schema";
import generatedImage from '@assets/generated_images/futuristic_gaming_cafe_interior_concept_art.png';

// Icon mapping for games fetched from API
const iconMap: Record<string, LucideIcon> = {
  Crosshair, Sword, Target, Flame, Pickaxe, Car, Swords, Globe, Sparkles, Gamepad2
};

// Icon mapping for apps fetched from API
const appIconMap: Record<string, LucideIcon> = {
  Chrome, Music, Video, FileText, Calculator, Camera, MessageSquare, Mail, AppWindow
};

const adSlides = [
  {
    id: 1,
    title: "Weekend Tournament",
    subtitle: "5v5 Battle - $500 Prize Pool",
    description: "Join this Saturday at 6PM. Registration open now!",
    gradient: "from-orange-600 to-red-600"
  },
  {
    id: 2,
    title: "Happy Hour Special",
    subtitle: "50% Off All Energy Drinks",
    description: "Every day from 3PM - 5PM",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: 3,
    title: "New Game Alert",
    subtitle: "Counter-Strike 2 Now Available",
    description: "Experience the next generation of CS",
    gradient: "from-green-600 to-teal-600"
  }
];

// Default fallback image for games
const defaultGameImage = generatedImage;

// Mock Data with real game images and icons
const games = [
  { id: 1, name: "Valorant", category: "FPS", image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4fd6a11df4eb2c7c8e368e88b78e97ebb00f4688-1920x1080.jpg", icon: Crosshair },
  { id: 2, name: "League of Legends", category: "MOBA", image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4c44f7838e9c3a6ae8f02fc2f1e5a0ce66e2cf20-1920x1080.jpg", icon: Swords },
  { id: 3, name: "Counter-Strike 2", category: "FPS", image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg", icon: Target },
  { id: 4, name: "Apex Legends", category: "Battle Royale", image: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg", icon: Flame },
  { id: 5, name: "Dota 2", category: "MOBA", image: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg", icon: Sword },
  { id: 6, name: "Fortnite", category: "Battle Royale", image: "https://cdn2.unrealengine.com/en-eg-desktop-background-1923x1080-1923x1080-828a5d1ebb0f.jpg", icon: Target },
  { id: 7, name: "Minecraft", category: "Sandbox", image: "https://cdn.akamai.steamstatic.com/steam/apps/1672970/header.jpg", icon: Pickaxe },
  { id: 8, name: "Rocket League", category: "Sports", image: "https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg", icon: Car },
  { id: 9, name: "GTA V", category: "Action", image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg", icon: Car },
  { id: 10, name: "PUBG", category: "Battle Royale", image: "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg", icon: Target },
  { id: 11, name: "Overwatch 2", category: "FPS", image: "https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt7f4c77fd14dff1c7/646e51bc2d39af49a3c2e0a4/ow2-homepage-hero-bg.webp", icon: Crosshair },
  { id: 12, name: "FIFA 24", category: "Sports", image: "https://cdn.akamai.steamstatic.com/steam/apps/2195250/header.jpg", icon: Globe },
];

// Game card component with image fallback
function GameCard({ 
  game, 
  onLaunch, 
  size = "normal",
  testIdPrefix = "card-game"
}: { 
  game: typeof games[0]; 
  onLaunch: (name: string) => void;
  size?: "normal" | "large";
  testIdPrefix?: string;
}) {
  const [imgSrc, setImgSrc] = useState(game.image);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(defaultGameImage);
    }
  };

  const iconSize = size === "large" ? "h-24 w-24" : "h-20 w-20";
  const textSize = size === "large" ? "text-lg" : "text-sm";
  const padding = size === "large" ? "p-4" : "p-3";
  const playBtnSize = size === "large" ? "h-16 w-16" : "h-14 w-14";
  const playIconSize = size === "large" ? "h-8 w-8" : "h-7 w-7";

  return (
    <div 
      className="group relative aspect-[3/4] bg-card rounded-xl overflow-hidden border border-white/5 shadow-lg hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,107,0,0.2)] transition-all cursor-pointer"
      onClick={() => onLaunch(game.name)}
      data-testid={`${testIdPrefix}-${game.id}`}
    >
      <img 
        src={imgSrc}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <game.icon className={cn(iconSize, "text-white drop-shadow-lg")} />
      </div>
      <div className={cn("absolute bottom-0 left-0 w-full", padding)}>
        <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">{game.category}</p>
        <h4 className={cn("text-white font-bold leading-tight group-hover:text-primary transition-colors", textSize)}>{game.name}</h4>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
        <div className={cn("bg-primary rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform", playBtnSize)}>
          <Play className={cn("text-white ml-1", playIconSize)} fill="white" />
        </div>
      </div>
    </div>
  );
}

const foodMenu = [
  { id: 1, name: "Red Bull", price: 4.50, category: "Energy" },
  { id: 2, name: "Pizza Slice", price: 3.00, category: "Food" },
  { id: 3, name: "Nachos", price: 6.50, category: "Snacks" },
  { id: 4, name: "Coke", price: 2.50, category: "Drinks" },
  { id: 5, name: "Monster Energy", price: 4.00, category: "Energy" },
  { id: 6, name: "Hot Dog", price: 4.50, category: "Food" },
];

type ActiveTab = "home" | "games" | "apps" | "food" | "rewards" | "tournaments" | "friends" | "profile" | "settings" | "help";

// Format seconds to HH:MM:SS
function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// App Taskbar Data
const taskbarApps = [
  { id: 1, name: "Chrome", icon: Chrome, color: "bg-blue-500/20" },
  { id: 2, name: "Discord", icon: MessageSquare, color: "bg-indigo-500/20" },
  { id: 3, name: "Spotify", icon: Music, color: "bg-green-500/20" },
  { id: 4, name: "YouTube", icon: Video, color: "bg-red-500/20" },
  { id: 5, name: "Calculator", icon: Calculator, color: "bg-gray-500/20" },
  { id: 6, name: "Files", icon: FileText, color: "bg-purple-500/20" },
];

// App Taskbar Component
function AppTaskbar({ onLaunchApp }: { onLaunchApp: (appName: string) => void }) {
  return (
    <div className="h-16 bg-card/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-center px-4 shrink-0">
      <div className="flex items-center gap-2">
        {taskbarApps.map((app) => (
          <Button
            key={app.id}
            size="icon"
            variant="ghost"
            className={cn(
              "h-12 w-12 rounded-xl transition-all hover:scale-110",
              app.color
            )}
            onClick={() => onLaunchApp(app.name)}
            data-testid={`taskbar-app-${app.id}`}
          >
            <app.icon className="h-6 w-6 text-white" />
          </Button>
        ))}
        <div className="w-px h-8 bg-white/10 mx-2" />
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12 rounded-xl bg-primary/20 hover:bg-primary/30"
          data-testid="taskbar-all-apps"
        >
          <AppWindow className="h-6 w-6 text-primary" />
        </Button>
      </div>
    </div>
  );
}

export default function Launcher() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLocked, setIsLocked] = useState(true);
  const [showSessionSelection, setShowSessionSelection] = useState(false);
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
    { id: "apps" as const, icon: AppWindow, label: "Apps" },
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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [userBalance] = useState(24.50);
  const [sessionTimeRemainingSeconds, setSessionTimeRemainingSeconds] = useState(7200);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(120);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [customHours, setCustomHours] = useState("0");
  const [customMinutes, setCustomMinutes] = useState("30");
  const [sessionCost, setSessionCost] = useState(0);
  const [showLogoutSummary, setShowLogoutSummary] = useState(false);
  const [finalSessionData, setFinalSessionData] = useState<{startTime: Date; endTime: Date; totalMinutes: number; totalCost: number} | null>(null);
  const [showGuestUsernameInput, setShowGuestUsernameInput] = useState(false);
  const [guestUsername, setGuestUsername] = useState("");
  const hourlyRate = 5.00;

  const { data: timePackages = [] } = useQuery<TimePackage[]>({
    queryKey: ["/api/time-packages/active"]
  });

  useEffect(() => {
    if (!sessionStartTime || isUnlimited || isLocked) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
      const totalDurationSeconds = sessionDurationMinutes * 60;
      const remaining = Math.max(0, totalDurationSeconds - elapsed);
      setSessionTimeRemainingSeconds(remaining);
      
      if (remaining <= 0) {
        toast({
          title: "Session Expired",
          description: "Your gaming session has ended. Please select a new session.",
          variant: "destructive",
        });
        setIsLocked(true);
        setShowSessionSelection(false);
        setSessionStartTime(null);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionStartTime, sessionDurationMinutes, isUnlimited, isLocked]);

  const sessionTimeLeft = formatTimeRemaining(sessionTimeRemainingSeconds);

  useEffect(() => {
    const adTimer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % adSlides.length);
    }, 5000);
    return () => clearInterval(adTimer);
  }, []);

  const handleLogin = () => {
    if (username && password) {
      toast({
        title: "Logging in...",
        description: `Welcome back, ${username}!`,
      });
      setLoggedInUser(username);
      setShowSessionSelection(true);
      setIsLocked(false);
    } else {
      toast({
        title: "Login Required",
        description: "Please enter your username and password.",
        variant: "destructive",
      });
    }
  };

  const handleSessionSelect = (pkg: TimePackage) => {
    const totalMinutes = (pkg.durationHours * 60) + (pkg.durationMinutes || 0);
    const isUnlimitedSession = totalMinutes >= 600;
    const cost = parseFloat(pkg.price);
    
    toast({
      title: "Session Started",
      description: isUnlimitedSession 
        ? "Unlimited gaming time activated!" 
        : `${pkg.name} session started. Enjoy!`,
    });
    
    setIsUnlimited(isUnlimitedSession);
    setSessionDurationMinutes(totalMinutes);
    setSessionTimeRemainingSeconds(totalMinutes * 60);
    setSessionStartTime(new Date());
    setSessionCost(cost);
    setShowSessionSelection(false);
    setIsLocked(false);
    setUsername("");
    setPassword("");
  };

  const handleCustomTimeStart = () => {
    const hours = parseInt(customHours) || 0;
    const minutes = parseInt(customMinutes) || 0;
    const totalMinutes = (hours * 60) + minutes;
    
    if (totalMinutes < 1) {
      toast({
        title: "Invalid Time",
        description: "Please enter at least 1 minute.",
        variant: "destructive",
      });
      return;
    }
    
    const cost = (totalMinutes / 60) * hourlyRate;
    
    toast({
      title: "Session Started",
      description: `${hours > 0 ? hours + " hr " : ""}${minutes > 0 ? minutes + " min" : ""} session started. Amount: $${cost.toFixed(2)}`,
    });
    
    setIsUnlimited(false);
    setSessionDurationMinutes(totalMinutes);
    setSessionTimeRemainingSeconds(totalMinutes * 60);
    setSessionStartTime(new Date());
    setSessionCost(cost);
    setShowSessionSelection(false);
    setIsLocked(false);
    setUsername("");
    setPassword("");
  };

  const handleLogout = () => {
    if (sessionStartTime) {
      const endTime = new Date();
      const elapsedMs = endTime.getTime() - sessionStartTime.getTime();
      const usedMinutes = Math.ceil(elapsedMs / 60000);
      const totalCost = (usedMinutes / 60) * hourlyRate;
      
      setFinalSessionData({
        startTime: sessionStartTime,
        endTime,
        totalMinutes: usedMinutes,
        totalCost
      });
      setShowLogoutSummary(true);
    } else {
      setIsLocked(true);
    }
  };

  const handleConfirmLogout = () => {
    setShowLogoutSummary(false);
    setFinalSessionData(null);
    setSessionStartTime(null);
    setIsLocked(true);
  };

  // Guest Username Input Screen
  if (showGuestUsernameInput) {
    return (
      <div className="h-screen w-screen bg-black relative overflow-hidden flex flex-col font-display">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${generatedImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-10" />
        
        <div className="relative z-20 flex items-center justify-between px-8 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-xl skew-x-[-10deg]">G</div>
            <span className="text-2xl font-bold tracking-wider text-white">GGCIRCUIT</span>
          </div>
          <div className="flex items-center gap-4 text-white/60 font-mono text-sm">
            <span>PC-08</span><span>|</span><span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="h-16 w-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Guest Login</h1>
            <p className="text-white/60 mb-6">Enter your name to continue</p>
            
            <div className="space-y-4">
              <Input 
                placeholder="Enter your name"
                value={guestUsername}
                onChange={(e) => setGuestUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && guestUsername.trim()) {
                    setLoggedInUser(guestUsername.trim());
                    setIsGuest(true);
                    setShowGuestUsernameInput(false);
                    setShowSessionSelection(true);
                  }
                }}
                className="h-12 bg-black/30 border-white/20 text-white text-center text-lg"
                data-testid="input-guest-username"
              />
              <Button 
                className="w-full h-12 bg-primary text-white font-bold"
                onClick={() => {
                  if (guestUsername.trim()) {
                    setLoggedInUser(guestUsername.trim());
                    setIsGuest(true);
                    setShowGuestUsernameInput(false);
                    setShowSessionSelection(true);
                  } else {
                    toast({
                      title: "Name Required",
                      description: "Please enter your name to continue.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-guest-continue"
              >
                Continue
              </Button>
              <Button 
                variant="ghost"
                className="w-full text-white/60"
                onClick={() => {
                  setShowGuestUsernameInput(false);
                  setGuestUsername("");
                }}
                data-testid="button-guest-cancel"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logout Summary Screen
  if (showLogoutSummary && finalSessionData) {
    const formatTime = (date: Date) => date.toLocaleTimeString();
    const hours = Math.floor(finalSessionData.totalMinutes / 60);
    const mins = finalSessionData.totalMinutes % 60;
    
    return (
      <div className="h-screen w-screen bg-black relative overflow-hidden flex flex-col font-display">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${generatedImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-10" />
        
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="h-16 w-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Session Complete</h1>
            <p className="text-white/60 mb-6">Thank you for gaming with us!</p>
            
            <div className="space-y-4 text-left bg-black/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white/60">Start Time:</span>
                <span className="text-white font-mono">{formatTime(finalSessionData.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">End Time:</span>
                <span className="text-white font-mono">{formatTime(finalSessionData.endTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Time Used:</span>
                <span className="text-white font-mono">
                  {hours > 0 ? `${hours} hr ` : ""}{mins} min
                </span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="text-white font-bold">Amount to Pay:</span>
                <span className="text-2xl font-mono font-bold text-primary">${finalSessionData.totalCost.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-primary text-white font-bold"
              onClick={handleConfirmLogout}
              data-testid="button-confirm-logout"
            >
              OK - Lock Terminal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Session Selection Screen
  if (showSessionSelection) {
    return (
      <div className="h-screen w-screen bg-black relative overflow-hidden flex flex-col font-display">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `url(${generatedImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-10" />
        
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between px-8 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-xl skew-x-[-10deg]">
              G
            </div>
            <span className="text-2xl font-bold tracking-wider text-white">GGCIRCUIT</span>
          </div>
          <div className="flex items-center gap-4 text-white/60 font-mono text-sm">
            <span>PC-08</span>
            <span>|</span>
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-8 py-6">
          {/* User Profile Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 w-full max-w-md">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/50">
                <AvatarImage src="https://i.pravatar.cc/150?u=gamer123" />
                <AvatarFallback className="bg-primary text-white text-xl">
                  {loggedInUser ? loggedInUser.slice(0, 2).toUpperCase() : "PG"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{loggedInUser || "ProGamer_99"}</h2>
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/40 text-xs mt-1">
                  Gold Member
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50 uppercase tracking-wider">Balance</p>
                <p className="text-2xl font-mono font-bold text-emerald-400">${userBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Session Selection */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Select Your Session</h1>
            <p className="text-white/60">Choose how long you want to play</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            {timePackages.map((pkg) => {
              const totalMinutes = (pkg.durationHours * 60) + (pkg.durationMinutes || 0);
              const isUnlimitedPkg = totalMinutes >= 600;
              const pricePerHour = totalMinutes > 0 ? (parseFloat(pkg.price) / (totalMinutes / 60)) : 0;
              
              return (
                <button
                  key={pkg.id}
                  onClick={() => handleSessionSelect(pkg)}
                  data-testid={`button-session-${pkg.id}`}
                  className={cn(
                    "relative bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center transition-all hover:border-primary/50 hover:bg-white/10 group",
                    isUnlimitedPkg && "border-primary/30 bg-primary/5"
                  )}
                >
                  {isUnlimitedPkg && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white text-xs">Best Value</Badge>
                    </div>
                  )}
                  <div className={cn(
                    "h-12 w-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                    isUnlimitedPkg ? "bg-primary/20" : "bg-white/10"
                  )}>
                    <Clock className={cn(
                      "h-6 w-6",
                      isUnlimitedPkg ? "text-primary" : "text-white/60"
                    )} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-2xl font-mono font-bold text-primary">${parseFloat(pkg.price).toFixed(2)}</p>
                  {!isUnlimitedPkg && pricePerHour > 0 && (
                    <p className="text-xs text-white/40 mt-1">${pricePerHour.toFixed(2)}/hr</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Time Section */}
          <div className="mt-8 w-full max-w-md">
            <div className="text-center mb-4">
              <p className="text-white/60 text-sm">Or add custom time</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Hours</label>
                  <Input 
                    type="number" 
                    min="0" 
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    className="bg-black/30 border-white/10 text-center text-white font-mono text-lg"
                    data-testid="input-custom-hours"
                  />
                </div>
                <span className="text-white/40 text-2xl pt-5">:</span>
                <div className="flex-1">
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Minutes</label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="59"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="bg-black/30 border-white/10 text-center text-white font-mono text-lg"
                    data-testid="input-custom-minutes"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-white/60">Rate: ${hourlyRate.toFixed(2)}/hr</span>
                <span className="text-lg font-mono font-bold text-primary">
                  ${(((parseInt(customHours) || 0) * 60 + (parseInt(customMinutes) || 0)) / 60 * hourlyRate).toFixed(2)}
                </span>
              </div>
              <Button 
                className="w-full bg-primary text-white font-bold"
                onClick={handleCustomTimeStart}
                data-testid="button-start-custom-session"
              >
                <Play className="h-4 w-4 mr-2" /> Start Session
              </Button>
            </div>
          </div>

          {/* Balance Warning */}
          {userBalance < 5 && (
            <div className="mt-6 flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Low balance! Please add funds at the front desk.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-20 px-8 py-4 flex items-center justify-between text-white/40 text-xs font-mono bg-black/40 border-t border-white/10">
          <span>PC-08 | GGCIRCUIT CLIENT v2.4</span>
          <Button 
            variant="ghost" 
            className="text-white/60 hover:text-white"
            onClick={() => {
              setShowSessionSelection(false);
              setIsLocked(true);
            }}
            data-testid="button-cancel-session"
          >
            Cancel & Lock Terminal
          </Button>
        </div>
      </div>
    );
  }

  if (isLocked) {
    const currentAd = adSlides[currentAdIndex];
    
    return (
      <div className="h-screen w-screen bg-black relative overflow-hidden flex flex-col font-display">
        {/* Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            backgroundImage: `url(${generatedImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black z-10" />
        
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-xl skew-x-[-10deg]">
              G
            </div>
            <span className="text-2xl font-bold tracking-wider text-white">GGCIRCUIT</span>
          </div>
          <div className="flex items-center gap-4 text-white/60 font-mono text-sm">
            <span>PC-08</span>
            <span>|</span>
            <span data-testid="text-login-time">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Ads Section - 16:9 Ratio */}
        <div className="relative z-20 flex items-center justify-center px-8 py-4">
          <div className="w-full max-w-4xl">
            {/* Main Ad Banner - 16:9 Aspect Ratio */}
            <div 
              className={cn(
                "relative w-full aspect-video max-h-[50vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500",
                `bg-gradient-to-br ${currentAd.gradient}`
              )}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <Badge className="mb-4 bg-white/20 text-white border-white/30 uppercase tracking-wider text-xs px-3 py-1">
                  Featured
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                  {currentAd.title}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 font-semibold mb-2">
                  {currentAd.subtitle}
                </p>
                <p className="text-base text-white/70 max-w-xl">
                  {currentAd.description}
                </p>
              </div>
              
              {/* Ad Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {adSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAdIndex(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      index === currentAdIndex 
                        ? "w-6 bg-white" 
                        : "w-2 bg-white/40 hover:bg-white/60"
                    )}
                    data-testid={`ad-dot-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Login Section - Bottom */}
        <div className="relative z-20 bg-black/60 backdrop-blur-xl border-t border-white/10 px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-8">
              {/* QR Code Section */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="h-32 w-32 bg-white rounded-xl p-2 shadow-lg">
                  <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOSAyOSI+PHBhdGggZD0iTTAgMGgyOXYyOUgweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xIDFoN3Y3SDFWMXptMSAxdjVoNVYySDJ6bTEgMWgzdjNIM1Yzem04LTJoMXYxaC0xVjF6bTIgMGgydjFoLTFWMmgxVjFoLTJWMHptMyAxaDF2MWgtMVYyem0yLTFoMXYyaC0xVjF6bTIgMGg0djFoLTF2MWgxdjFoLTF2LTFoLTFWMmgtMVYxaC0xVjB6bTcgMGg3djdoLTd6bTEgMXY1aDVWMmgtNXptMSAxaDN2M2gtM1Yzek0xIDloMXYxSDFWOXptMiAwaDJ2MUg0VjloMXYxSDNWOXptMyAwaDF2MUg2Vjl6bTYgMGgxdjFoLTFWOXptNCAwaDJ2MWgtMVYxMGgxVjloLTJ2MXptNS0xaDF2MWgtMVY4em0yIDBoMXYxaC0xVjh6bTEgMGgxdjJoLTF2MWgxdjFoLTFWOXptMiAxaDJ2MWgtMXYxaDF2LTFoMXYyaC0ydi0xaC0xVjl6TTEgMTFoMXYxSDFWMTF6bTIgMGgxdjFoMXYxaC0xdi0xSDN2MWgxdjFINHYxSDNWMTN6bTMgMGgydjFIN3YtMUg2VjExem0zIDBoMXYxaC0xdi0xaDFWMTBIOS4xdi0xaDF2MWgxVjl6bTQgMGgxdjJoLTF2MWgyVjEzaC0xdi0xaDF2LTFoLTJ6bTcgMGgxdjFoLTFWMTF6bS02IDFoMXYxaC0xVjEyem0yIDBoMnYxaC0xdjFoMXYxaC0xdi0xaC0xdi0xaDF6bTQgMGgxdjJoLTF6bTIgMGgxdjFoLTFWMTJ6bS02IDFoMXYxaC0xVjEzem04IDBoMXYxaC0xVjEzem0tMTYgMWgxdjFIN3YtMXptOCAwaDJ2MWgtMXYxaDF2LTFoMXYxaC0xdjFoLTF2LTFoLTFWMTR6bTUgMGgxdjJoMVYxNWgydjFoLTF2MWgxdi0xaDF2MmgtMXYxaC0ydi0xaC0xdi0xaC0xdi0xaDF2LTFoLTFWMTR6bTYgMGgxdjFoLTFWMTR6bS0xNyAxaDF2MWgtMXYtMXptOCAwaDJ2MmgtMnYtMnptNiAwaDFWMTZoMXYxaC0yVjE1em0tMTUgMWgxdjFINHYtMXptNCAwaDJ2MWgxdjFoLTF2MmgtMVYxOEg4VjE3aDFWMTZoLTF6bTMgMGgxdjFoMVYxNmgxdjJoLTJ2LTFoLTFWMTZ6bTYgMGgydjFoLTF2MWgtMXYtMXptNiAwaDJ2MmgtMXYtMWgtMXYtMXptMyAwaDJ2MUgyOHYxaC0xdi0xaC0xdi0xem0zIDBoMXYxaC0xVjE2ek0xIDE3aDd2N0gxVjE3em0xIDF2NWg1VjE4SDJ6bTEgMWgzdjNIM1YxOXptNy0yaDF2MWgtMVYxN3ptMTcgMGg3djdoLTdWMTd6bTEgMXY1aDVWMThoLTV6bTEgMWgzdjNoLTN2LTN6bS04LTFoMXYxaC0xVjE4em0zIDBoMXYxaC0xVjE4em0tNSAxaDJ2MWgtMVYyMGgtMXYtMXptMyAwaDFWMjBoMVYxOWgtMnptMyAxaDF2MWgtMVYyMHptLTQgMWgxdjFoLTFWMjF6bTEgMGgxdjFoLTFWMjF6bTEgMGgxdjFoLTFWMjF6bTMgMGgxdjJoLTF2LTJ6bS0zIDFoMXYxaC0xVjIyem0tMiAxaDF2MWgtMVYyM3ptMSAwaDJ2MWgtMnYtMXptMyAwaDFWMjVoLTF2MWgtMXYtMWgxVjIzem0tNCAzaDF2MWgtMVYyNnptMSAwaDFWMjhoMXYxaC0yVjI2em0yIDBoMXYxaC0xVjI2eiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-contain bg-no-repeat bg-center" />
                </div>
                <p className="text-sm text-white/60 flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Scan to Login
                </p>
              </div>

              {/* Divider */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="h-20 w-px bg-white/20" />
                <span className="text-white/40 text-sm">or</span>
                <div className="h-20 w-px bg-white/20" />
              </div>

              {/* Login Form */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-white mb-4">
                  <Keyboard className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Login with Username</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                      data-testid="input-username"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                      data-testid="input-password"
                    />
                  </div>
                  <Button 
                    size="lg"
                    className="h-12 px-8 bg-primary text-white font-bold"
                    onClick={handleLogin}
                    data-testid="button-login"
                  >
                    LOGIN
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white/40 text-sm">
                    Don't have an account? Ask staff at the front desk to create one.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      setShowGuestUsernameInput(true);
                    }}
                    data-testid="button-guest-login"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login as Guest
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="relative z-20 px-8 py-3 flex items-center justify-between text-white/40 text-xs font-mono bg-black/40">
          <span>PC-08 | GGCIRCUIT CLIENT v2.4</span>
          <span>Need help? Call staff or press F1</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col font-body selection:bg-primary/30">
      {/* Desktop Background - Full Screen */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{ 
          backgroundImage: `url(${generatedImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }} 
      />
      
      {/* Main Content Area with Right Side Full Widget */}
      <div className="flex-1 relative flex">
        {/* Desktop Area */}
        <div className="flex-1 relative">
          {/* Slide-out Panel for Content */}
          {activeTab !== "home" && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col">
              {/* Panel Header */}
              <header className="h-12 bg-card/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setActiveTab("home")}
                    data-testid="button-close-panel"
                  >
                    <X className="h-5 w-5 text-white" />
                  </Button>
                  <h1 className="text-lg font-display font-bold text-white uppercase tracking-wider">
                    {sidebarItems.find(i => i.id === activeTab)?.label || 
                     bottomItems.find(i => i.id === activeTab)?.label || ""}
                  </h1>
                </div>
              </header>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-5xl mx-auto">
                  {activeTab === "games" && <GamesContent onLaunch={handleLaunch} />}
                  {activeTab === "apps" && <AppsContent />}
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
          )}
        </div>

        {/* Right Side Full Widget - Profile, Timer, Action Buttons */}
        <div className="relative z-50 w-20 bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md border-l border-gray-600/50 flex flex-col items-center py-3 gap-2">
          {/* Logo */}
          <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-lg mb-1">
            <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center text-white font-display font-bold text-xl skew-x-[-5deg]">
              G
            </div>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center gap-1 py-2 border-b border-gray-600/50 w-full">
            <Avatar className="h-12 w-12 border-2 border-primary/50">
              {isGuest ? (
                <AvatarFallback className="bg-gray-600 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src="https://i.pravatar.cc/150?u=gamer123" />
                  <AvatarFallback className="bg-primary text-white text-sm">
                    {loggedInUser ? loggedInUser.slice(0, 2).toUpperCase() : "PG"}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <p className="font-display font-bold text-white text-[10px] leading-tight text-center truncate w-full px-1">
              {isGuest ? "Guest" : loggedInUser || "ProGamer"}
            </p>
            <Badge className={cn(
              "text-[8px] py-0 h-3.5",
              isGuest 
                ? "bg-gray-500/30 text-gray-300 border-gray-500/50"
                : "bg-yellow-500/30 text-yellow-400 border-yellow-500/50"
            )}>
              {isGuest ? "Guest" : "Gold"}
            </Badge>
          </div>

          {/* Session Time */}
          <div className="flex flex-col items-center py-2 border-b border-gray-600/50 w-full">
            <Clock className="h-5 w-5 text-primary mb-1" />
            <p className="text-[7px] text-gray-400 uppercase tracking-wider leading-none">Time Left</p>
            <p className={cn(
              "text-xs font-mono font-bold leading-tight",
              isUnlimited ? "text-emerald-400" : "text-white"
            )} data-testid="text-session-time">
              {isUnlimited ? "UNLIM" : sessionTimeLeft}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-2 py-2 flex-1">
            <Button 
              size="icon"
              className="w-11 h-11 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl shadow-lg"
              onClick={() => setActiveTab("food")}
              data-testid="widget-btn-food"
            >
              <Utensils className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon"
              className="w-11 h-11 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl shadow-lg"
              onClick={() => setActiveTab("tournaments")}
              data-testid="widget-btn-tournament"
            >
              <Trophy className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon"
              className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-lg"
              onClick={() => setActiveTab("games")}
              data-testid="widget-btn-games"
            >
              <Gamepad2 className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon"
              className="w-11 h-11 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl shadow-lg"
              onClick={() => setActiveTab("rewards")}
              data-testid="widget-btn-rewards"
            >
              <Gift className="h-5 w-5" />
            </Button>

            <Button 
              size="icon"
              className="w-11 h-11 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-xl shadow-lg"
              onClick={() => setActiveTab("apps")}
              data-testid="widget-btn-apps"
            >
              <AppWindow className="h-5 w-5" />
            </Button>

            <Button 
              size="icon"
              className="w-11 h-11 bg-gradient-to-br from-pink-600 to-pink-700 text-white rounded-xl shadow-lg"
              onClick={() => setActiveTab("friends")}
              data-testid="widget-btn-friends"
            >
              <Users className="h-5 w-5" />
            </Button>
          </div>

          {/* Bottom Actions - Commands, Order, Logout */}
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-gray-600/50 w-full">
            <Button 
              size="icon"
              variant="outline"
              className="w-11 h-11 bg-gray-700/50 border-gray-500/50 text-white rounded-xl"
              onClick={() => {
                toast({
                  title: "Commands",
                  description: "Opening command menu...",
                });
              }}
              data-testid="widget-btn-commands"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon"
              variant="outline"
              className="w-11 h-11 bg-gray-700/50 border-gray-500/50 text-white rounded-xl"
              onClick={() => setActiveTab("food")}
              data-testid="widget-btn-give-order"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>

            <Button 
              size="icon"
              variant="outline"
              className="w-11 h-11 bg-red-900/50 border-red-500/50 text-red-400 rounded-xl"
              onClick={handleLogout}
              data-testid="widget-btn-logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Promotional Ads Data for Gamers
const promotionalAds = [
  {
    id: 1,
    title: "Game Pass Ultimate",
    subtitle: "3 Months Free",
    description: "Get unlimited access to 100+ premium games with Xbox Game Pass",
    cta: "Claim Now",
    gradient: "from-green-600 to-emerald-700",
    badge: "HOT DEAL",
    badgeColor: "bg-red-500"
  },
  {
    id: 2,
    title: "Razer Gaming Gear",
    subtitle: "30% Off All Peripherals",
    description: "Level up your setup with pro-grade mice, keyboards & headsets",
    cta: "Shop Now",
    gradient: "from-green-500 to-lime-600",
    badge: "LIMITED",
    badgeColor: "bg-yellow-500"
  },
  {
    id: 3,
    title: "Monster Energy",
    subtitle: "Buy 2 Get 1 Free",
    description: "Fuel your gaming sessions with ice-cold energy drinks at the counter",
    cta: "Order Now",
    gradient: "from-lime-500 to-green-600",
    badge: "IN-STORE",
    badgeColor: "bg-green-500"
  },
  {
    id: 4,
    title: "NVIDIA RTX 5090",
    subtitle: "Pre-Order Now",
    description: "Experience next-gen gaming with ray tracing & DLSS 4.0",
    cta: "Learn More",
    gradient: "from-emerald-600 to-teal-700",
    badge: "NEW",
    badgeColor: "bg-blue-500"
  }
];

const sponsoredContent = [
  {
    id: 1,
    sponsor: "Intel Gaming",
    title: "Core i9 Gaming Rigs",
    description: "Ultimate performance for competitive gaming",
    gradient: "from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    sponsor: "HyperX",
    title: "Cloud III Headset",
    description: "Crystal clear audio for immersive gameplay",
    gradient: "from-red-600 to-rose-700"
  },
  {
    id: 3,
    sponsor: "G FUEL",
    title: "New Flavor Drop",
    description: "Try our latest gaming energy formula",
    gradient: "from-pink-500 to-purple-600"
  }
];

// Home Content
function HomeContent({ onLaunch, onOrder }: { onLaunch: (name: string) => void; onOrder: (name: string) => void }) {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promotionalAds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

      {/* Featured Promotions & Ads Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Featured Deals & Promotions
          </h3>
          <div className="flex items-center gap-2">
            {promotionalAds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPromoIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentPromoIndex === idx ? "bg-primary w-4" : "bg-white/30"
                )}
                data-testid={`button-promo-dot-${idx}`}
              />
            ))}
          </div>
        </div>
        
        {/* Main Promo Carousel */}
        <div className="relative h-[160px] rounded-xl overflow-hidden mb-4 border border-white/10">
          {promotionalAds.map((ad, idx) => (
            <div
              key={ad.id}
              className={cn(
                "absolute inset-0 transition-all duration-500 p-6 flex items-center justify-between",
                `bg-gradient-to-r ${ad.gradient}`,
                currentPromoIndex === idx ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              )}
              data-testid={`card-promo-${ad.id}`}
            >
              <div className="flex-1">
                <Badge className={cn("text-white text-xs font-bold mb-2", ad.badgeColor)}>
                  {ad.badge}
                </Badge>
                <h4 className="text-3xl font-display font-bold text-white mb-1">{ad.title}</h4>
                <p className="text-white/90 text-lg font-semibold mb-1">{ad.subtitle}</p>
                <p className="text-white/70 text-sm max-w-md">{ad.description}</p>
              </div>
              <Button className="bg-white text-black hover:bg-gray-100 font-bold px-6" data-testid={`button-promo-cta-${ad.id}`}>
                {ad.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Sponsored Content Grid */}
        <div className="grid grid-cols-3 gap-4">
          {sponsoredContent.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative rounded-lg overflow-hidden p-4 cursor-pointer transition-transform hover:scale-[1.02] border border-white/10",
                `bg-gradient-to-br ${item.gradient}`
              )}
              data-testid={`card-sponsored-${item.id}`}
            >
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Sponsored by {item.sponsor}</p>
              <h5 className="text-white font-bold text-lg mb-1">{item.title}</h5>
              <p className="text-white/80 text-sm">{item.description}</p>
            </div>
          ))}
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
            <GameCard 
              key={game.id} 
              game={game} 
              onLaunch={onLaunch}
              testIdPrefix="card-game"
            />
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
function GamesContent({ onLaunch }: { onLaunch: (name: string, execPath?: string | null) => void }) {
  const { games: tauriGames, isLoading: isGamesLoading, isScanning, isTauriApp, scanForGames, launchGame } = useTauriGames();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showInstalledOnly, setShowInstalledOnly] = useState(false);
  
  const categories = ["FPS", "MOBA", "Battle Royale", "Sports", "Sandbox", "Action"];
  
  const filteredGames = tauriGames.filter(game => {
    if (filterCategory && game.category !== filterCategory) return false;
    if (showInstalledOnly && !game.is_installed) return false;
    return true;
  });

  const handleGameLaunch = async (game: GameInfo) => {
    if (isTauriApp && game.is_installed && game.executable_path) {
      const result = await launchGame(game.id, game.executable_path);
      if (result.success) {
        onLaunch(game.name, game.executable_path);
      }
    } else {
      onLaunch(game.name);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <Button 
            className={filterCategory === null ? "bg-primary text-white" : ""}
            variant={filterCategory === null ? "default" : "outline"}
            onClick={() => setFilterCategory(null)}
          >
            All Games
          </Button>
          {categories.map(cat => (
            <Button 
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"} 
              className={filterCategory === cat ? "bg-primary text-white" : "border-white/10"}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        {isTauriApp && (
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-white/10"
              onClick={() => setShowInstalledOnly(!showInstalledOnly)}
            >
              {showInstalledOnly ? "Show All" : "Installed Only"}
            </Button>
            <Button 
              variant="outline" 
              className="border-primary/50 text-primary"
              onClick={scanForGames}
              disabled={isScanning}
            >
              {isScanning ? "Scanning..." : "Scan for Games"}
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isGamesLoading ? (
          <div className="col-span-full text-center text-muted-foreground py-12">Loading games...</div>
        ) : filteredGames.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">No games available. Add games in Launcher Settings.</div>
        ) : (
          filteredGames.map((game) => (
            <TauriGameCard 
              key={game.id} 
              game={game} 
              onLaunch={() => handleGameLaunch(game)}
              isTauriApp={isTauriApp}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TauriGameCard({ game, onLaunch, isTauriApp }: { game: GameInfo; onLaunch: () => void; isTauriApp: boolean }) {
  const [imgSrc, setImgSrc] = useState(game.image_url);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(generatedImage);
    }
  };

  return (
    <div 
      className={cn(
        "group relative aspect-[3/4] bg-card rounded-xl overflow-hidden border shadow-lg transition-all cursor-pointer",
        game.is_installed 
          ? "border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          : "border-white/5 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,107,0,0.2)]",
        !game.is_installed && isTauriApp && "opacity-60"
      )}
      onClick={onLaunch}
      data-testid={`card-game-library-${game.id}`}
    >
      <img 
        src={imgSrc}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
      
      {isTauriApp && (
        <div className="absolute top-2 right-2">
          <Badge className={game.is_installed 
            ? "bg-emerald-500/80 text-white border-emerald-400/50 text-xs" 
            : "bg-gray-500/80 text-white border-gray-400/50 text-xs"
          }>
            {game.is_installed ? "Installed" : "Not Found"}
          </Badge>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 w-full p-4">
        <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">{game.category}</p>
        <h4 className="text-lg text-white font-bold leading-tight group-hover:text-primary transition-colors">{game.name}</h4>
        {game.platform && (
          <p className="text-xs text-white/50 mt-1 capitalize">{game.platform}</p>
        )}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
        <div className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform",
          game.is_installed ? "bg-emerald-500" : "bg-primary"
        )}>
          <Play className="h-8 w-8 text-white ml-1" fill="white" />
        </div>
      </div>
    </div>
  );
}

// Cart Item Type
type CartItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
};

// Food Content
function FoodContent({ onOrder }: { onOrder: (name: string) => void }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  const { data: apiFoodItems = [], isLoading: isFoodLoading } = useQuery<LauncherFoodItem[]>({
    queryKey: ["/api/launcher/food-items"]
  });
  
  const activeFoodItems = apiFoodItems.filter(item => item.isActive);

  const addToCart = (item: LauncherFoodItem) => {
    const numericId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    setCart(prev => {
      const existing = prev.find(c => c.id === numericId);
      if (existing) {
        return prev.map(c => c.id === numericId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { id: numericId, name: item.name, price, category: item.category, quantity: 1 }];
    });
    toast({
      title: "Added to Cart",
      description: `${item.name} added to your cart.`,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        if (newQty <= 0) return c;
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const items = cart.map(c => `${c.quantity}x ${c.name}`).join(', ');
    onOrder(items);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <Button className="bg-primary text-white">All Items</Button>
            <Button variant="outline" className="border-white/10">Energy</Button>
            <Button variant="outline" className="border-white/10">Drinks</Button>
            <Button variant="outline" className="border-white/10">Food</Button>
            <Button variant="outline" className="border-white/10">Snacks</Button>
          </div>
          <Button 
            variant="outline" 
            className="border-primary/50 text-primary relative"
            onClick={() => setShowCart(!showCart)}
            data-testid="button-toggle-cart"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Cart
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white text-xs">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isFoodLoading ? (
            <div className="col-span-full text-center text-muted-foreground py-12">Loading menu...</div>
          ) : activeFoodItems.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">No menu items available. Add items in Launcher Settings.</div>
          ) : (
            activeFoodItems.map((item) => {
              const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
              return (
                <div 
                  key={item.id} 
                  className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all group"
                  data-testid={`card-menu-${item.id}`}
                >
                  {item.imageUrl ? (
                    <div className="h-24 w-24 mx-auto rounded-full overflow-hidden mb-4 group-hover:scale-110 transition-transform">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Utensils className="h-10 w-10 text-primary/80" />
                    </div>
                  )}
                  <h3 className="font-bold text-white text-center mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-3">{item.category}</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-primary font-mono font-bold text-lg">${price.toFixed(2)}</p>
                    <Button 
                      size="sm" 
                      className="bg-white/5 hover:bg-primary hover:text-white"
                      onClick={() => addToCart(item)}
                      data-testid={`button-add-${item.id}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showCart && (
        <div className="w-80 shrink-0 bg-card border border-border/50 rounded-xl p-4 h-fit sticky top-0" data-testid="cart-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Your Cart
            </h3>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setShowCart(false)}
              data-testid="button-close-cart"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/60">Add items from the menu</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="bg-background/50 rounded-lg p-3" data-testid={`cart-item-${item.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm">{item.name}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-6 w-6 border-white/10"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          -
                        </Button>
                        <span className="text-white font-mono w-6 text-center">{item.quantity}</span>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-6 w-6 border-white/10"
                          onClick={() => updateQuantity(item.id, 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          +
                        </Button>
                      </div>
                      <span className="text-primary font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 mt-4 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-xl font-mono font-bold text-primary">${cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                  onClick={handleCheckout}
                  data-testid="button-checkout"
                >
                  Place Order
                </Button>
              </div>
            </>
          )}
        </div>
      )}
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

// Apps Content
function AppsContent() {
  const apps = [
    { id: 1, name: "Chrome", description: "Web Browser", icon: Chrome, category: "Browsers", color: "bg-blue-500/20" },
    { id: 2, name: "Spotify", description: "Music Streaming", icon: Music, category: "Entertainment", color: "bg-green-500/20" },
    { id: 3, name: "Discord", description: "Voice & Text Chat", icon: MessageSquare, category: "Communication", color: "bg-indigo-500/20" },
    { id: 4, name: "YouTube", description: "Video Streaming", icon: Video, category: "Entertainment", color: "bg-red-500/20" },
    { id: 5, name: "Notepad++", description: "Text Editor", icon: FileText, category: "Productivity", color: "bg-purple-500/20" },
    { id: 6, name: "Calculator", description: "Quick Math", icon: Calculator, category: "Utilities", color: "bg-gray-500/20" },
    { id: 7, name: "OBS Studio", description: "Screen Recording", icon: Camera, category: "Streaming", color: "bg-zinc-500/20" },
    { id: 8, name: "Gmail", description: "Email Client", icon: Mail, category: "Communication", color: "bg-red-400/20" },
  ];

  const handleLaunchApp = (appName: string) => {
    toast({
      title: "Launching App",
      description: `Opening ${appName}...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button className="bg-primary text-white">All Apps</Button>
        <Button variant="outline" className="border-white/10">Browsers</Button>
        <Button variant="outline" className="border-white/10">Entertainment</Button>
        <Button variant="outline" className="border-white/10">Communication</Button>
        <Button variant="outline" className="border-white/10">Productivity</Button>
        <Button variant="outline" className="border-white/10">Utilities</Button>
        <Button variant="outline" className="border-white/10">Streaming</Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {apps.map((app) => (
          <div 
            key={app.id} 
            className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 cursor-pointer transition-all group"
            onClick={() => handleLaunchApp(app.name)}
            data-testid={`card-app-${app.id}`}
          >
            <div className={cn("h-16 w-16 mx-auto rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", app.color)}>
              <app.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-white text-center mb-1 group-hover:text-primary transition-colors">{app.name}</h3>
            <p className="text-sm text-muted-foreground text-center mb-3">{app.description}</p>
            <Badge variant="secondary" className="w-full justify-center text-xs">{app.category}</Badge>
          </div>
        ))}
      </div>

      {/* Quick Launch Section */}
      <div className="mt-8">
        <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recently Used
        </h3>
        <div className="flex gap-4 flex-wrap">
          {apps.slice(0, 4).map((app) => (
            <div 
              key={app.id}
              className="flex items-center gap-3 bg-card/50 border border-white/5 rounded-lg px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors group"
              onClick={() => handleLaunchApp(app.name)}
              data-testid={`quick-app-${app.id}`}
            >
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", app.color)}>
                <app.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-primary transition-colors">{app.name}</p>
                <p className="text-xs text-muted-foreground">{app.description}</p>
              </div>
            </div>
          ))}
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
