import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Server, Shield, Palette, LayoutTemplate, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ClientGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mock generation process
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Installer Generated",
        description: "Client software installer has been compiled successfully.",
      });
    }, 2500);
  };

  return (
    <MainLayout title="Client Software Generator">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
        
        {/* Configuration Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Server className="h-5 w-5" />
                </div>
                <CardTitle className="text-white">Connection Settings</CardTitle>
              </div>
              <CardDescription>Configure how the client software connects to this server</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Target Terminal</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-background/50 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terminals (Generic Installer)</SelectItem>
                    <SelectItem value="pc1">PC 1</SelectItem>
                    <SelectItem value="pc2">PC 2</SelectItem>
                    <SelectItem value="pc3">PC 3</SelectItem>
                    <SelectItem value="pc4">PC 4</SelectItem>
                    <SelectItem value="pc5">PC 5</SelectItem>
                  </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">Select a specific terminal to bake its ID into the config</p>
              </div>
              <div className="space-y-2">
                <Label>Server Hostname / IP</Label>
                <Input defaultValue="192.168.1.100" className="font-mono bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input defaultValue="8080" className="font-mono bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2 md:col-span-2">
                 <Label>Failover Server (Optional)</Label>
                 <Input placeholder="Secondary IP address" className="font-mono bg-background/50 border-white/10" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-white">Security & Policies</CardTitle>
              </div>
              <CardDescription>Lockdown and security restrictions for client PCs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-white/5">
                    <Label className="cursor-pointer">Disable Task Manager</Label>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-white/5">
                    <Label className="cursor-pointer">Disable Windows Keys</Label>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-white/5">
                    <Label className="cursor-pointer">Block USB Storage</Label>
                    <Switch />
                 </div>
                 <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-white/5">
                    <Label className="cursor-pointer">Auto-Logout on Idle</Label>
                    <Switch defaultChecked />
                 </div>
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="space-y-2">
                <Label>Admin Unlock Password</Label>
                <Input type="password" defaultValue="secure_admin_123" className="font-mono bg-background/50 border-white/10" />
                <p className="text-xs text-muted-foreground">Password used to manually unlock a terminal during outage</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <Palette className="h-5 w-5" />
                </div>
                <CardTitle className="text-white">Branding & UI</CardTitle>
              </div>
              <CardDescription>Customize the look of the client login screen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme Preset</Label>
                  <Select defaultValue="cyber">
                    <SelectTrigger className="bg-background/50 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cyber">Cyber Dark (Default)</SelectItem>
                      <SelectItem value="clean">Clean Light</SelectItem>
                      <SelectItem value="minimal">Minimalist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label>Accent Color</Label>
                   <div className="flex gap-2 pt-1">
                      <div className="h-8 w-8 rounded-full bg-primary cursor-pointer ring-2 ring-white/20 ring-offset-2 ring-offset-background"></div>
                      <div className="h-8 w-8 rounded-full bg-blue-500 cursor-pointer opacity-50 hover:opacity-100"></div>
                      <div className="h-8 w-8 rounded-full bg-purple-500 cursor-pointer opacity-50 hover:opacity-100"></div>
                      <div className="h-8 w-8 rounded-full bg-emerald-500 cursor-pointer opacity-50 hover:opacity-100"></div>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Action Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fake Login Screen Preview */}
              <div className="aspect-video w-full rounded-lg bg-black border-4 border-zinc-800 relative overflow-hidden flex flex-col items-center justify-center group">
                 <div className="absolute inset-0 bg-primary/5"></div>
                 {/* Grid Pattern */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                 
                 <div className="w-24 h-8 bg-primary/20 rounded mb-4 flex items-center justify-center border border-primary/30 text-primary font-bold text-xs skew-x-[-10deg]">
                    GGCIRCUIT
                 </div>
                 <div className="w-32 h-2 bg-white/10 rounded mb-2"></div>
                 <div className="w-32 h-2 bg-white/10 rounded"></div>
                 
                 <div className="absolute bottom-4 right-4 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Target Platform:</span>
                   <span className="text-white font-medium">Windows 10/11 (x64)</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Version:</span>
                   <span className="text-white font-medium">v2.4.0 (Stable)</span>
                </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Size:</span>
                   <span className="text-white font-medium">~45 MB</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-primary text-white hover:bg-primary/90 font-bold h-14 text-lg"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Compiling...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Generate Installer
                  </>
                )}
              </Button>
              
              {!isGenerating && (
                <p className="text-xs text-center text-muted-foreground px-4">
                  Generates a signed .msi installer package pre-configured with the settings above.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </MainLayout>
  );
}
