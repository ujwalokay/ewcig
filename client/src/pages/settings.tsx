import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TimePackage } from "@shared/schema";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function TimePackageForm({ 
  pkg, 
  onSave, 
  onCancel 
}: { 
  pkg?: TimePackage; 
  onSave: (data: { name: string; durationHours: number; durationMinutes: number; price: string; isActive: boolean; sortOrder: number }) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(pkg?.name || "");
  const [durationHours, setDurationHours] = useState(pkg?.durationHours?.toString() || "0");
  const [durationMinutes, setDurationMinutes] = useState(pkg?.durationMinutes?.toString() || "30");
  const [price, setPrice] = useState(pkg?.price || "5.00");
  const [isActive, setIsActive] = useState(pkg?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(pkg?.sortOrder?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseInt(durationHours) || 0;
    const minutes = parseInt(durationMinutes) || 0;
    if (hours === 0 && minutes === 0) {
      return;
    }
    onSave({
      name,
      durationHours: hours,
      durationMinutes: minutes,
      price,
      isActive,
      sortOrder: parseInt(sortOrder)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Package Name</Label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g., 30 Minutes or 2 Hours"
          className="bg-background/50 border-white/10"
          data-testid="input-package-name"
          required
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Hours</Label>
          <Input 
            type="number" 
            min="0"
            value={durationHours} 
            onChange={(e) => setDurationHours(e.target.value)} 
            className="bg-background/50 border-white/10"
            data-testid="input-duration-hours"
          />
        </div>
        <div className="space-y-2">
          <Label>Minutes</Label>
          <Input 
            type="number" 
            min="0"
            max="59"
            value={durationMinutes} 
            onChange={(e) => setDurationMinutes(e.target.value)} 
            className="bg-background/50 border-white/10"
            data-testid="input-duration-minutes"
          />
        </div>
        <div className="space-y-2">
          <Label>Price ($)</Label>
          <Input 
            type="number" 
            step="0.01"
            min="0"
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="bg-background/50 border-white/10"
            data-testid="input-package-price"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input 
            type="number" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            className="bg-background/50 border-white/10"
            data-testid="input-sort-order"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch 
            checked={isActive} 
            onCheckedChange={setIsActive}
            data-testid="switch-package-active"
          />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-save-package">
          {pkg ? "Update" : "Create"} Package
        </Button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { toast } = useToast();
  const [editingPackage, setEditingPackage] = useState<TimePackage | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  const { data: timePackages = [], isLoading } = useQuery<TimePackage[]>({
    queryKey: ["/api/time-packages"]
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; durationHours: number; durationMinutes: number; price: string; isActive: boolean; sortOrder: number }) => {
      return apiRequest("POST", "/api/time-packages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-packages"] });
      setIsAddingPackage(false);
      toast({ title: "Time package created successfully" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TimePackage> }) => {
      return apiRequest("PATCH", `/api/time-packages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-packages"] });
      setEditingPackage(null);
      toast({ title: "Time package updated successfully" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/time-packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-packages"] });
      toast({ title: "Time package deleted" });
    }
  });

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
                <Input defaultValue="Matrix Gaming Arena" className="bg-background/50 border-white/10" data-testid="input-cafe-name" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input defaultValue="UTC-5 (Eastern Time)" className="bg-background/50 border-white/10" data-testid="input-timezone" />
              </div>
            </div>
            
            <Separator className="bg-white/10" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-white">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Prevent new logins across all terminals</p>
              </div>
              <Switch data-testid="switch-maintenance-mode" />
            </div>
             <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-white">Auto-Shutdown</Label>
                <p className="text-sm text-muted-foreground">Shutdown terminals after 15m idle</p>
              </div>
              <Switch defaultChecked data-testid="switch-auto-shutdown" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Time Packages</CardTitle>
              <CardDescription>Manage time options shown to users in the launcher</CardDescription>
            </div>
            <Dialog open={isAddingPackage} onOpenChange={setIsAddingPackage}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="button-add-time-package">
                  <Plus className="h-4 w-4 mr-1" /> Add Package
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Add Time Package</DialogTitle>
                </DialogHeader>
                <TimePackageForm 
                  onSave={(data) => createMutation.mutate(data)}
                  onCancel={() => setIsAddingPackage(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading time packages...</p>
            ) : timePackages.length === 0 ? (
              <p className="text-muted-foreground">No time packages configured. Add your first package to get started.</p>
            ) : (
              <div className="space-y-3">
                {timePackages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    className="flex items-center justify-between gap-4 p-4 rounded-lg bg-background/30 border border-white/5"
                    data-testid={`row-time-package-${pkg.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.durationHours > 0 && `${pkg.durationHours} hour${pkg.durationHours !== 1 ? "s" : ""}`}
                          {pkg.durationHours > 0 && pkg.durationMinutes > 0 && " "}
                          {pkg.durationMinutes > 0 && `${pkg.durationMinutes} min`}
                          {pkg.durationHours === 0 && pkg.durationMinutes === 0 && "No duration set"}
                          {" "}- ${pkg.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${pkg.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                      <Dialog open={editingPackage?.id === pkg.id} onOpenChange={(open) => !open && setEditingPackage(null)}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => setEditingPackage(pkg)} data-testid={`button-edit-package-${pkg.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle>Edit Time Package</DialogTitle>
                          </DialogHeader>
                          {editingPackage && (
                            <TimePackageForm 
                              pkg={editingPackage}
                              onSave={(data) => updateMutation.mutate({ id: editingPackage.id, data })}
                              onCancel={() => setEditingPackage(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => deleteMutation.mutate(pkg.id)}
                        data-testid={`button-delete-package-${pkg.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                   <Input defaultValue="5.00" className="bg-background/50 border-white/10" data-testid="input-standard-rate" />
                </div>
                <div className="space-y-2">
                   <Label>Member Rate ($/hr)</Label>
                   <Input defaultValue="3.50" className="bg-background/50 border-white/10" data-testid="input-member-rate" />
                </div>
                <div className="space-y-2">
                   <Label>VIP Rate ($/hr)</Label>
                   <Input defaultValue="8.00" className="bg-background/50 border-white/10" data-testid="input-vip-rate" />
                </div>
             </div>
             <div className="flex justify-end">
                <Button className="bg-primary text-white" data-testid="button-save-pricing">Save Changes</Button>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
           <CardHeader>
            <CardTitle className="text-white">Loyalty & Points System</CardTitle>
            <CardDescription>Configure point thresholds for member tiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                   <Label>Points per $1 Spent</Label>
                   <Input defaultValue="10" className="bg-background/50 border-white/10" data-testid="input-points-per-dollar" />
                </div>
             </div>
             
             <Separator className="bg-white/10" />
             
             <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">Tier Thresholds (Points Required)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                     <Label className="text-orange-400">Bronze Range</Label>
                     <div className="flex items-center gap-2">
                        <Input defaultValue="0" className="bg-background/50 border-white/10" disabled data-testid="input-bronze-min" />
                        <span className="text-muted-foreground">-</span>
                        <Input defaultValue="999" className="bg-background/50 border-white/10" data-testid="input-bronze-max" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-slate-300">Silver Range</Label>
                     <div className="flex items-center gap-2">
                        <Input defaultValue="1000" className="bg-background/50 border-white/10" data-testid="input-silver-min" />
                        <span className="text-muted-foreground">-</span>
                        <Input defaultValue="4999" className="bg-background/50 border-white/10" data-testid="input-silver-max" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-yellow-500">Gold Range</Label>
                     <div className="flex items-center gap-2">
                        <Input defaultValue="5000" className="bg-background/50 border-white/10" data-testid="input-gold-min" />
                        <span className="text-muted-foreground">+</span>
                     </div>
                  </div>
                </div>
             </div>
             
             <div className="flex justify-end">
                <Button className="bg-primary text-white" data-testid="button-update-thresholds">Update Thresholds</Button>
             </div>
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}
