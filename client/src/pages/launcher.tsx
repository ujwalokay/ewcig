import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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
  X, Minus, Plus, Trash2, QrCode, Keyboard, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import generatedImage from '@assets/generated_images/futuristic_gaming_cafe_interior_concept_art.png';

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

// Mock Data with real game images
const games = [
  { id: 1, name: "Valorant", category: "FPS", image: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3f072336e3f3ade4/63096d7be4a8c30e088e7720/Valorant_2022_E5A2_PlayVALORANT_ContentStackThumbnail_1200x625_MB01.png" },
  { id: 2, name: "League of Legends", category: "MOBA", image: "https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt9a2715ced150db6c/5db05f4e02ac7e6862e9ac1a/league-of-legends-og-image.jpg" },
  { id: 3, name: "Counter-Strike 2", category: "FPS", image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/header.jpg" },
  { id: 4, name: "Apex Legends", category: "Battle Royale", image: "https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg" },
  { id: 5, name: "Dota 2", category: "MOBA", image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/header.jpg" },
  { id: 6, name: "Fortnite", category: "Battle Royale", image: "https://cdn2.unrealengine.com/blade-702x390-702x390-e14e42b8e938.jpg" },
  { id: 7, name: "Minecraft", category: "Sandbox", image: "https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/Vanilla-PMP_Collection-702x394.jpg" },
  { id: 8, name: "Rocket League", category: "Sports", image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/252950/header.jpg" },
  { id: 9, name: "GTA V", category: "Action", image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg" },
  { id: 10, name: "PUBG", category: "Battle Royale", image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/578080/header.jpg" },
  { id: 11, name: "Overwatch 2", category: "FPS", image: "https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt01010c1e12763129/62ea8957e5e7e42300b213bb/OVR_S1_KeyArt_Banner.jpg" },
  { id: 12, name: "FIFA 24", category: "Sports", image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2195250/header.jpg" },
];

const foodMenu = [
  { id: 1, name: "Red Bull", price: 4.50, category: "Energy" },
  { id: 2, name: "Pizza Slice", price: 3.00, category: "Food" },
  { id: 3, name: "Nachos", price: 6.50, category: "Snacks" },
  { id: 4, name: "Coke", price: 2.50, category: "Drinks" },
  { id: 5, name: "Monster Energy", price: 4.00, category: "Energy" },
  { id: 6, name: "Hot Dog", price: 4.50, category: "Food" },
];

type ActiveTab = "home" | "games" | "apps" | "food" | "rewards" | "tournaments" | "friends" | "profile" | "settings" | "help";

// Session time options with pricing
const sessionOptions = [
  { id: 1, hours: 1, price: 5.00, label: "1 Hour" },
  { id: 2, hours: 2, price: 9.00, label: "2 Hours" },
  { id: 3, hours: 3, price: 12.00, label: "3 Hours" },
  { id: 4, hours: 5, price: 18.00, label: "5 Hours" },
  { id: 5, hours: 0, price: 25.00, label: "Unlimited", isUnlimited: true },
];

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
  const [sessionTimeLeft, setSessionTimeLeft] = useState("02:00:00");
  const [isUnlimited, setIsUnlimited] = useState(false);

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

  const handleSessionSelect = (option: typeof sessionOptions[0]) => {
    toast({
      title: "Session Started",
      description: option.isUnlimited 
        ? "Unlimited gaming time activated!" 
        : `${option.hours} hour(s) session started. Enjoy!`,
    });
    setIsUnlimited(option.isUnlimited || false);
    if (!option.isUnlimited && option.hours > 0) {
      const h = String(option.hours).padStart(2, '0');
      setSessionTimeLeft(`${h}:00:00`);
    }
    setShowSessionSelection(false);
    setUsername("");
    setPassword("");
  };

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

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-4xl">
            {sessionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSessionSelect(option)}
                data-testid={`button-session-${option.id}`}
                className={cn(
                  "relative bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center transition-all hover:border-primary/50 hover:bg-white/10 group",
                  option.isUnlimited && "md:col-span-1 border-primary/30 bg-primary/5"
                )}
              >
                {option.isUnlimited && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white text-xs">Best Value</Badge>
                  </div>
                )}
                <div className={cn(
                  "h-12 w-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                  option.isUnlimited ? "bg-primary/20" : "bg-white/10"
                )}>
                  <Clock className={cn(
                    "h-6 w-6",
                    option.isUnlimited ? "text-primary" : "text-white/60"
                  )} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {option.label}
                </h3>
                <p className="text-2xl font-mono font-bold text-primary">${option.price.toFixed(2)}</p>
                {!option.isUnlimited && (
                  <p className="text-xs text-white/40 mt-1">${(option.price / option.hours).toFixed(2)}/hr</p>
                )}
              </button>
            ))}
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
                      toast({
                        title: "Guest Login",
                        description: "Logging in as Guest user...",
                      });
                      setIsGuest(true);
                      setIsLocked(false);
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
              {isGuest ? (
                <AvatarFallback className="bg-gray-600 text-white">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src="https://i.pravatar.cc/150?u=gamer123" />
                  <AvatarFallback className="bg-primary text-white">PG</AvatarFallback>
                </>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-white truncate">
                {isGuest ? "Guest User" : loggedInUser || "ProGamer_99"}
              </p>
              <Badge className={isGuest 
                ? "bg-gray-500/20 text-gray-400 border-gray-500/40 text-xs"
                : "bg-yellow-500/20 text-yellow-500 border-yellow-500/40 text-xs"
              }>
                {isGuest ? "Guest" : "Gold Member"}
              </Badge>
            </div>
          </div>
          
          {/* Session Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-sidebar-accent/50 rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Time Left</p>
              <p className={cn(
                "text-lg font-mono font-bold",
                isUnlimited ? "text-emerald-400" : "text-white"
              )}>
                {isUnlimited ? "UNLIMITED" : sessionTimeLeft}
              </p>
            </div>
            <div className="bg-sidebar-accent/50 rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Balance</p>
              <p className="text-lg font-mono font-bold text-emerald-400">
                ${userBalance.toFixed(2)}
              </p>
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
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url(${game.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
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
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundImage: `url(${game.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
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

  const addToCart = (item: typeof foodMenu[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
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
          {foodMenu.map((item) => (
            <div 
              key={item.id} 
              className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all group"
              data-testid={`card-menu-${item.id}`}
            >
              <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Utensils className="h-10 w-10 text-primary/80" />
              </div>
              <h3 className="font-bold text-white text-center mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
              <p className="text-sm text-muted-foreground text-center mb-3">{item.category}</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-primary font-mono font-bold text-lg">${item.price.toFixed(2)}</p>
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
          ))}
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
