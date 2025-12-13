import { Sidebar } from "@/components/layout/sidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

export function MainLayout({ children, title, actions }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none z-0" />
        
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-display font-bold text-white hidden md:block uppercase tracking-wider">
              {title || "Command Center"}
            </h1>
            <div className="max-w-md w-full relative ml-8 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Global search..." 
                className="pl-9 bg-card/50 border-white/5 text-white focus:border-primary/50 focus:ring-primary/20 h-9"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {actions}
            
            <div className="h-6 w-px bg-white/10 mx-2" />
            
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full animate-pulse" />
            </Button>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-muted-foreground">Level 5 Access</p>
              </div>
              <Avatar className="h-9 w-9 border border-primary/20 ring-2 ring-primary/10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 z-10 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
