import { useState, useEffect } from "react";
// @ts-ignore - Tauri API available at runtime
import { invoke } from "@tauri-apps/api/core";
import { cn } from "./lib/utils";
import { 
  Gamepad2, Clock, ShoppingCart, Bell, Wifi, 
  Volume2, Search, Play, Utensils, Lock, Home, 
  Trophy, Settings, HelpCircle, Gift, Users, 
  AppWindow, User, Chrome, Music, Video, MessageSquare
} from "lucide-react";

interface TerminalConfig {
  terminal_id: string;
  server_url: string;
  terminal_name: string;
}

interface SessionData {
  active: boolean;
  username: string;
  timeRemaining: number;
  balance: number;
  memberTier: string;
}

interface TimePackage {
  id: string;
  name: string;
  durationHours: number;
  price: string;
  isActive: boolean;
  sortOrder: number;
}

const games = [
  { id: 1, name: "Valorant", category: "FPS", path: "C:\\Riot Games\\Valorant\\VALORANT.exe" },
  { id: 2, name: "League of Legends", category: "MOBA", path: "C:\\Riot Games\\League of Legends\\LeagueClient.exe" },
  { id: 3, name: "Counter-Strike 2", category: "FPS", path: "steam://rungameid/730" },
  { id: 4, name: "Apex Legends", category: "Battle Royale", path: "steam://rungameid/1172470" },
  { id: 5, name: "Dota 2", category: "MOBA", path: "steam://rungameid/570" },
  { id: 6, name: "Fortnite", category: "Battle Royale", path: "com.epicgames.launcher://apps/fn" },
  { id: 7, name: "Minecraft", category: "Sandbox", path: "minecraft://" },
  { id: 8, name: "Rocket League", category: "Sports", path: "steam://rungameid/252950" },
];

const foodMenu = [
  { id: 1, name: "Red Bull", price: 4.50, category: "Energy" },
  { id: 2, name: "Pizza Slice", price: 3.00, category: "Food" },
  { id: 3, name: "Nachos", price: 6.50, category: "Snacks" },
  { id: 4, name: "Coke", price: 2.50, category: "Drinks" },
  { id: 5, name: "Monster Energy", price: 4.00, category: "Energy" },
  { id: 6, name: "Hot Dog", price: 4.50, category: "Food" },
];

const apps = [
  { id: 1, name: "Chrome", icon: Chrome, path: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" },
  { id: 2, name: "Spotify", icon: Music, path: "spotify://" },
  { id: 3, name: "Discord", icon: MessageSquare, path: "discord://" },
  { id: 4, name: "OBS Studio", icon: Video, path: "C:\\Program Files\\obs-studio\\bin\\64bit\\obs64.exe" },
];

type ActiveTab = "home" | "games" | "apps" | "food" | "rewards" | "tournaments" | "friends" | "profile" | "settings" | "help";

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [config, setConfig] = useState<TerminalConfig | null>(null);
  const [session, setSession] = useState<SessionData>({
    active: false,
    username: "",
    timeRemaining: 0,
    balance: 0,
    memberTier: "Guest"
  });
  const [timePackages, setTimePackages] = useState<TimePackage[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadConfig();
    pollSession();
    const interval = setInterval(pollSession, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (config) {
      loadTimePackages();
    }
  }, [config]);

  async function loadConfig() {
    try {
      const cfg = await invoke<TerminalConfig>("get_terminal_config");
      setConfig(cfg);
    } catch (e) {
      console.error("Failed to load config:", e);
    }
  }

  async function loadTimePackages() {
    if (!config) return;
    try {
      const response = await fetch(`${config.server_url}/api/time-packages/active`);
      if (response.ok) {
        const packages = await response.json();
        setTimePackages(packages);
      }
    } catch (e) {
      console.error("Failed to load time packages:", e);
    }
  }

  async function pollSession() {
    if (!config) return;
    try {
      const response = await fetch(`${config.server_url}/api/terminals/${config.terminal_id}/session`);
      if (response.ok) {
        const data = await response.json();
        setSession(data);
        setIsLocked(!data.active);
      }
    } catch (e) {
      console.error("Failed to poll session:", e);
    }
  }

  async function handleLaunchGame(gamePath: string, gameName: string) {
    try {
      await invoke("launch_game", { gamePath });
      await logActivity("game_launch", gameName);
    } catch (e) {
      console.error("Failed to launch game:", e);
    }
  }

  async function logActivity(type: string, details: string) {
    if (!config) return;
    try {
      await fetch(`${config.server_url}/api/activity-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          terminalId: config.terminal_id,
          type,
          details,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error("Failed to log activity:", e);
    }
  }

  async function handleLock() {
    setIsLocked(true);
    await logActivity("terminal_locked", "User locked terminal");
  }

  async function handleOrder(itemName: string, price: number) {
    if (!config) return;
    try {
      await fetch(`${config.server_url}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          terminalId: config.terminal_id,
          item: itemName,
          price,
          timestamp: new Date().toISOString()
        })
      });
      await logActivity("food_order", itemName);
    } catch (e) {
      console.error("Failed to place order:", e);
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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

  if (isLocked) {
    return (
      <div className="h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-purple-900/20" />
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', 
          backgroundSize: '40px 40px' 
        }} />
        
        <div className="z-20 text-center space-y-6">
          <div className="h-24 w-24 bg-orange-500 rounded-xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,107,0,0.5)]">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-widest">TERMINAL LOCKED</h1>
          <p className="text-xl text-orange-500 font-mono">{config?.terminal_name || "Loading..."}</p>
          <p className="text-gray-400">Please login at the front desk to start your session</p>
          
          <div className="mt-8 text-gray-500 font-mono text-sm">
            {config?.terminal_id} | Server: {config?.server_url || "Connecting..."}
          </div>
        </div>
        
        <div className="absolute bottom-8 left-8 z-20 text-white/50 font-mono text-sm">
          {config?.terminal_id} | GGCIRCUIT CLIENT v2.4
        </div>
        
        <div className="absolute bottom-8 right-8 z-20 text-white/50 font-mono text-sm">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[hsl(240,10%,4%)] overflow-hidden flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-[hsl(240,6%,8%)] border-r border-white/5 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-orange-500">
            <div className="h-8 w-8 bg-orange-500 rounded-sm flex items-center justify-center text-white font-bold text-xl skew-x-[-10deg]">
              G
            </div>
            <span className="text-xl font-bold tracking-wider text-white">GGCIRCUIT</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {session.username.slice(0, 2).toUpperCase() || "GU"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{session.username || "Guest"}</p>
              <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded">{session.memberTier}</span>
            </div>
          </div>
          
          {/* Session Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Time Left</p>
              <p className="text-lg font-mono font-bold text-white">{formatTime(session.timeRemaining)}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Balance</p>
              <p className="text-lg font-mono font-bold text-emerald-400">${session.balance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </div>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 relative overflow-hidden text-left",
                activeTab === item.id
                  ? "bg-orange-500/10 text-orange-500 font-medium"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              )}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
              )}
              <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-orange-500" : "")} />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="mt-6 px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </div>
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 relative overflow-hidden text-left",
                activeTab === item.id
                  ? "bg-orange-500/10 text-orange-500 font-medium"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              )}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
              )}
              <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-orange-500" : "")} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2"
            onClick={handleLock}
          >
            <Lock className="h-4 w-4" /> Lock Terminal
          </button>
          <div className="flex items-center justify-center gap-4 py-2">
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <Volume2 className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <Wifi className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[hsl(240,6%,10%)]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">
              {sidebarItems.find(i => i.id === activeTab)?.label || 
               bottomItems.find(i => i.id === activeTab)?.label || "Home"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text"
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div className="flex items-center gap-2 text-white/80 font-mono text-sm bg-black/20 rounded-full px-4 py-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-br from-[hsl(240,10%,4%)] via-[hsl(240,10%,4%)] to-black p-6 relative">
          <div className="absolute top-0 left-0 w-full h-[600px] bg-orange-500/5 blur-[150px] pointer-events-none" />
          
          <div className="relative z-10">
            {activeTab === "home" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {games.slice(0, 5).map((game) => (
                    <div 
                      key={game.id} 
                      className="group relative aspect-[3/4] bg-[hsl(240,6%,10%)] rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer"
                      onClick={() => handleLaunchGame(game.path, game.name)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-110 transition-transform duration-500">
                        <div className="flex items-center justify-center h-full text-white/5 font-bold text-3xl rotate-12 uppercase">
                          {game.category}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-0 left-0 p-3 w-full">
                        <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{game.category}</p>
                        <h4 className="text-white font-bold text-sm leading-tight group-hover:text-orange-500 transition-colors">{game.name}</h4>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                        <div className="h-14 w-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                          <Play className="h-7 w-7 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "games" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {games.map((game) => (
                  <div 
                    key={game.id} 
                    className="group relative aspect-[3/4] bg-[hsl(240,6%,10%)] rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer"
                    onClick={() => handleLaunchGame(game.path, game.name)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-110 transition-transform duration-500">
                      <div className="flex items-center justify-center h-full text-white/5 font-bold text-4xl rotate-12 uppercase">
                        {game.category}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{game.category}</p>
                      <h4 className="text-white font-bold text-lg leading-tight group-hover:text-orange-500 transition-colors">{game.name}</h4>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                      <div className="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                        <Play className="h-8 w-8 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "apps" && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {apps.map((app) => (
                  <div 
                    key={app.id}
                    className="group bg-[hsl(240,6%,10%)] border border-white/5 rounded-lg p-6 hover:bg-white/5 hover:border-orange-500/50 cursor-pointer transition-all flex flex-col items-center gap-3"
                    onClick={() => handleLaunchGame(app.path, app.name)}
                  >
                    <app.icon className="h-12 w-12 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-white font-medium">{app.name}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "food" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {foodMenu.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-[hsl(240,6%,10%)] border border-white/5 rounded-lg p-4 hover:bg-white/5 cursor-pointer transition-colors group"
                    onClick={() => handleOrder(item.name, item.price)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-bold group-hover:text-orange-500 transition-colors">{item.name}</p>
                      <span className="text-xs px-2 py-1 bg-white/10 text-gray-400 rounded">{item.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-orange-500 font-mono font-bold">${item.price.toFixed(2)}</p>
                      <button className="p-2 text-orange-500 hover:bg-orange-500/20 rounded transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "rewards" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Select Time Package</h2>
                  <p className="text-gray-400 mb-6">Choose how long you want to play. Prices are set by the admin.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {timePackages.map((pkg) => (
                    <div 
                      key={pkg.id} 
                      className="bg-[hsl(240,6%,10%)] border border-white/5 rounded-lg p-4 hover:bg-white/5 hover:border-orange-500/50 cursor-pointer transition-all group"
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="h-12 w-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-white font-bold group-hover:text-orange-500 transition-colors">{pkg.name}</p>
                          <p className="text-sm text-gray-500">{pkg.durationHours} hour{pkg.durationHours !== 1 ? "s" : ""}</p>
                        </div>
                        <p className="text-xl font-mono font-bold text-orange-500">${pkg.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {timePackages.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No time packages available.</p>
                    <p className="text-sm">Contact the front desk for assistance.</p>
                  </div>
                )}
              </div>
            )}

            {(activeTab === "tournaments" || activeTab === "friends" || activeTab === "profile" || activeTab === "settings" || activeTab === "help") && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Content coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
