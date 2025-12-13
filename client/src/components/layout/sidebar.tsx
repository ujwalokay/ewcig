import { Home, Monitor, Users, Gamepad2, ShoppingBag, Settings, LogOut, Activity, FileCode } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Monitor, label: "Terminals", href: "/terminals" },
    { icon: Users, label: "Members", href: "/members" },
    { icon: Gamepad2, label: "Games", href: "/games" },
    { icon: ShoppingBag, label: "Store", href: "/store" },
    { icon: Activity, label: "Reports", href: "/reports" },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-primary">
          <div className="h-8 w-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-display font-bold text-xl skew-x-[-10deg]">
            G
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-white">GGCIRCUIT</span>
        </div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden",
                location === item.href
                  ? "bg-sidebar-primary/10 text-primary font-medium"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
              )}
            >
              {location === item.href && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
              )}
              <item.icon className={cn("h-5 w-5", location === item.href ? "text-primary" : "group-hover:text-white")} />
              <span>{item.label}</span>
            </a>
          </Link>
        ))}

        <div className="mt-8 px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          System
        </div>
        <Link href="/client-generator">
          <a
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden",
              location === "/client-generator"
                ? "bg-sidebar-primary/10 text-primary font-medium"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
            )}
          >
             {location === "/client-generator" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
              )}
            <FileCode className={cn("h-5 w-5", location === "/client-generator" ? "text-primary" : "group-hover:text-white")} />
            <span>Client Generator</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </a>
        </Link>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent/50 rounded-lg p-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center border border-primary/20">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin Console</p>
            <p className="text-xs text-green-500">System Online</p>
          </div>
          <button className="text-muted-foreground hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
