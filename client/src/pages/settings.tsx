import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <MainLayout title="System Settings">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">General Configuration</CardTitle>
            <CardDescription>Basic settings for your cafe environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Cafe Name</Label>
                <Input defaultValue="Matrix Gaming Arena" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input defaultValue="UTC-5 (Eastern Time)" className="bg-background/50 border-white/10" />
              </div>
            </div>
            
            <Separator className="bg-white/10" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-white">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Prevent new logins across all terminals</p>
              </div>
              <Switch />
            </div>
             <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-white">Auto-Shutdown</Label>
                <p className="text-sm text-muted-foreground">Shutdown terminals after 15m idle</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
           <CardHeader>
            <CardTitle className="text-white">Pricing Tiers</CardTitle>
            <CardDescription>Manage hourly rates and member discounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                   <Label>Standard Rate ($/hr)</Label>
                   <Input defaultValue="5.00" className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                   <Label>Member Rate ($/hr)</Label>
                   <Input defaultValue="3.50" className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                   <Label>VIP Rate ($/hr)</Label>
                   <Input defaultValue="8.00" className="bg-background/50 border-white/10" />
                </div>
             </div>
             <div className="flex justify-end">
                <Button className="bg-primary text-white">Save Changes</Button>
             </div>
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}
