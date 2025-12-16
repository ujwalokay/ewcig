import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { LauncherGame, LauncherFoodItem, LauncherTournament, LauncherReward, LauncherApp } from "@shared/schema";
import { Plus, Pencil, Trash2, Gamepad2, UtensilsCrossed, Trophy, Gift, AppWindow, Upload, X, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ICON_OPTIONS = [
  "Gamepad2", "Target", "Crosshair", "Sword", "Swords", "Flame", "Pickaxe", "Car", "Globe"
];

const GAME_CATEGORIES = ["FPS", "MOBA", "Battle Royale", "Sports", "Sandbox", "Action", "Racing", "Strategy", "RPG"];
const FOOD_CATEGORIES = ["Snacks", "Drinks", "Meals", "Desserts"];
const REWARD_CATEGORIES = ["Gaming", "Food", "Merchandise", "Special"];
const APP_CATEGORIES = ["Streaming", "Communication", "Social", "Utility", "Entertainment"];

function ImageUpload({ 
  currentUrl, 
  onUpload, 
  onClear 
}: { 
  currentUrl?: string | null; 
  onUpload: (url: string) => void; 
  onClear: () => void 
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.url) {
        onUpload(data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Image</Label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      {currentUrl ? (
        <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
          <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
          <Button 
            type="button"
            size="icon" 
            variant="destructive" 
            className="absolute top-2 right-2"
            onClick={onClear}
            data-testid="button-remove-image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button 
          type="button"
          variant="outline" 
          className="w-full h-32 border-dashed"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-testid="button-upload-image"
        >
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <span className="text-muted-foreground">Uploading...</span>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Click to upload image</span>
              </>
            )}
          </div>
        </Button>
      )}
    </div>
  );
}

function GameForm({ 
  game, 
  onSave, 
  onCancel 
}: { 
  game?: LauncherGame; 
  onSave: (data: any) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(game?.name || "");
  const [category, setCategory] = useState(game?.category || "FPS");
  const [imageUrl, setImageUrl] = useState(game?.imageUrl || "");
  const [iconType, setIconType] = useState(game?.iconType || "Gamepad2");
  const [isActive, setIsActive] = useState(game?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(game?.sortOrder?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      category,
      imageUrl: imageUrl || null,
      iconType,
      isActive,
      sortOrder: parseInt(sortOrder)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Game Name</Label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g., Valorant"
          data-testid="input-game-name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-game-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GAME_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Icon</Label>
          <Select value={iconType} onValueChange={setIconType}>
            <SelectTrigger data-testid="select-game-icon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ICON_OPTIONS.map(icon => (
                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ImageUpload 
        currentUrl={imageUrl} 
        onUpload={setImageUrl} 
        onClear={() => setImageUrl("")} 
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input 
            type="number" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            data-testid="input-game-sort"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch 
            checked={isActive} 
            onCheckedChange={setIsActive}
            data-testid="switch-game-active"
          />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-game">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-save-game">
          {game ? "Update" : "Create"} Game
        </Button>
      </div>
    </form>
  );
}

function FoodForm({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item?: LauncherFoodItem; 
  onSave: (data: any) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [category, setCategory] = useState(item?.category || "Snacks");
  const [price, setPrice] = useState(item?.price || "0.00");
  const [description, setDescription] = useState(item?.description || "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || "");
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(item?.sortOrder?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      category,
      price,
      description: description || null,
      imageUrl: imageUrl || null,
      isActive,
      sortOrder: parseInt(sortOrder)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Item Name</Label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g., Pizza Slice"
          data-testid="input-food-name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-food-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FOOD_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price ($)</Label>
          <Input 
            type="number"
            step="0.01"
            min="0"
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            data-testid="input-food-price"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Optional description..."
          data-testid="input-food-description"
        />
      </div>
      <ImageUpload 
        currentUrl={imageUrl} 
        onUpload={setImageUrl} 
        onClear={() => setImageUrl("")} 
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input 
            type="number" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            data-testid="input-food-sort"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch 
            checked={isActive} 
            onCheckedChange={setIsActive}
            data-testid="switch-food-active"
          />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-food">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-save-food">
          {item ? "Update" : "Create"} Item
        </Button>
      </div>
    </form>
  );
}

function TournamentForm({ 
  tournament, 
  onSave, 
  onCancel 
}: { 
  tournament?: LauncherTournament; 
  onSave: (data: any) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(tournament?.name || "");
  const [game, setGame] = useState(tournament?.game || "");
  const [prizePool, setPrizePool] = useState(tournament?.prizePool || "");
  const [date, setDate] = useState(tournament?.date || "");
  const [time, setTime] = useState(tournament?.time || "");
  const [description, setDescription] = useState(tournament?.description || "");
  const [maxParticipants, setMaxParticipants] = useState(tournament?.maxParticipants?.toString() || "32");
  const [entryFee, setEntryFee] = useState(tournament?.entryFee || "0");
  const [isActive, setIsActive] = useState(tournament?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(tournament?.sortOrder?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      game,
      prizePool: prizePool || null,
      date,
      time,
      description: description || null,
      maxParticipants: parseInt(maxParticipants),
      currentParticipants: tournament?.currentParticipants || 0,
      entryFee,
      isActive,
      sortOrder: parseInt(sortOrder)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tournament Name</Label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g., Weekly Valorant Cup"
            data-testid="input-tournament-name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Game</Label>
          <Input 
            value={game} 
            onChange={(e) => setGame(e.target.value)} 
            placeholder="e.g., Valorant"
            data-testid="input-tournament-game"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            placeholder="e.g., Dec 25, 2024"
            data-testid="input-tournament-date"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Time</Label>
          <Input 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            placeholder="e.g., 2:00 PM"
            data-testid="input-tournament-time"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Prize Pool</Label>
          <Input 
            value={prizePool} 
            onChange={(e) => setPrizePool(e.target.value)} 
            placeholder="e.g., $500"
            data-testid="input-tournament-prize"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Max Participants</Label>
          <Input 
            type="number"
            min="2"
            value={maxParticipants} 
            onChange={(e) => setMaxParticipants(e.target.value)} 
            data-testid="input-tournament-max"
          />
        </div>
        <div className="space-y-2">
          <Label>Entry Fee ($)</Label>
          <Input 
            type="number"
            step="0.01"
            min="0"
            value={entryFee} 
            onChange={(e) => setEntryFee(e.target.value)} 
            data-testid="input-tournament-fee"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Tournament rules and details..."
          data-testid="input-tournament-description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input 
            type="number" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            data-testid="input-tournament-sort"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch 
            checked={isActive} 
            onCheckedChange={setIsActive}
            data-testid="switch-tournament-active"
          />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-tournament">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-save-tournament">
          {tournament ? "Update" : "Create"} Tournament
        </Button>
      </div>
    </form>
  );
}

function RewardForm({ 
  reward, 
  onSave, 
  onCancel 
}: { 
  reward?: LauncherReward; 
  onSave: (data: any) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(reward?.name || "");
  const [description, setDescription] = useState(reward?.description || "");
  const [pointsCost, setPointsCost] = useState(reward?.pointsCost?.toString() || "100");
  const [category, setCategory] = useState(reward?.category || "General");
  const [imageUrl, setImageUrl] = useState(reward?.imageUrl || "");
  const [isActive, setIsActive] = useState(reward?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(reward?.sortOrder?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description: description || null,
      pointsCost: parseInt(pointsCost),
      category,
      imageUrl: imageUrl || null,
      isActive,
      sortOrder: parseInt(sortOrder)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Reward Name</Label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g., Free Hour"
          data-testid="input-reward-name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-reward-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REWARD_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Points Cost</Label>
          <Input 
            type="number"
            min="0"
            value={pointsCost} 
            onChange={(e) => setPointsCost(e.target.value)} 
            data-testid="input-reward-points"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Reward details..."
          data-testid="input-reward-description"
        />
      </div>
      <ImageUpload 
        currentUrl={imageUrl} 
        onUpload={setImageUrl} 
        onClear={() => setImageUrl("")} 
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input 
            type="number" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            data-testid="input-reward-sort"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch 
            checked={isActive} 
            onCheckedChange={setIsActive}
            data-testid="switch-reward-active"
          />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-reward">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-save-reward">
          {reward ? "Update" : "Create"} Reward
        </Button>
      </div>
    </form>
  );
}

function AppForm({ 
  app, 
  onSave, 
  onCancel 
}: { 
  app?: LauncherApp; 
  onSave: (data: any) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(app?.name || "");
  const [category, setCategory] = useState(app?.category || "Utility");
  const [description, setDescription] = useState(app?.description || "");
  const [iconType, setIconType] = useState(app?.iconType || "AppWindow");
  const [isActive, setIsActive] = useState(app?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(app?.sortOrder?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      category,
      description: description || null,
      iconType,
      isActive,
      sortOrder: parseInt(sortOrder)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>App Name</Label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g., Discord"
          data-testid="input-app-name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-app-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APP_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Icon</Label>
          <Select value={iconType} onValueChange={setIconType}>
            <SelectTrigger data-testid="select-app-icon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ICON_OPTIONS.map(icon => (
                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="App description..."
          data-testid="input-app-description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input 
            type="number" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            data-testid="input-app-sort"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch 
            checked={isActive} 
            onCheckedChange={setIsActive}
            data-testid="switch-app-active"
          />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-app">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-save-app">
          {app ? "Update" : "Create"} App
        </Button>
      </div>
    </form>
  );
}

function GamesTab() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<LauncherGame | undefined>();

  const { data: games = [], isLoading } = useQuery<LauncherGame[]>({
    queryKey: ["/api/admin/launcher/games"]
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/launcher/games", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/games"] });
      toast({ title: "Game created successfully" });
      setDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/launcher/games/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/games"] });
      toast({ title: "Game updated successfully" });
      setDialogOpen(false);
      setEditingGame(undefined);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/launcher/games/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/games"] });
      toast({ title: "Game deleted successfully" });
    }
  });

  const handleSave = (data: any) => {
    if (editingGame) {
      updateMutation.mutate({ id: editingGame.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading games...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Manage games displayed in the user launcher</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingGame(undefined); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-game">
              <Plus className="h-4 w-4 mr-2" />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingGame ? "Edit Game" : "Add New Game"}</DialogTitle>
            </DialogHeader>
            <GameForm 
              game={editingGame} 
              onSave={handleSave} 
              onCancel={() => { setDialogOpen(false); setEditingGame(undefined); }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Card key={game.id} className={!game.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {game.imageUrl ? (
                  <img src={game.imageUrl} alt={game.name} className="w-16 h-16 rounded object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <Gamepad2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate" data-testid={`text-game-name-${game.id}`}>{game.name}</h3>
                  <p className="text-sm text-muted-foreground">{game.category}</p>
                  <p className="text-xs text-muted-foreground mt-1">Order: {game.sortOrder}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => { setEditingGame(game); setDialogOpen(true); }}
                    data-testid={`button-edit-game-${game.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => deleteMutation.mutate(game.id)}
                    data-testid={`button-delete-game-${game.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {games.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No games added yet. Click "Add Game" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function FoodTab() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LauncherFoodItem | undefined>();

  const { data: items = [], isLoading } = useQuery<LauncherFoodItem[]>({
    queryKey: ["/api/admin/launcher/food"]
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/launcher/food", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/food"] });
      toast({ title: "Food item created successfully" });
      setDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/launcher/food/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/food"] });
      toast({ title: "Food item updated successfully" });
      setDialogOpen(false);
      setEditingItem(undefined);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/launcher/food/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/food"] });
      toast({ title: "Food item deleted successfully" });
    }
  });

  const handleSave = (data: any) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading food items...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Manage food and drinks menu in the user launcher</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingItem(undefined); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-food">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Food Item" : "Add New Food Item"}</DialogTitle>
            </DialogHeader>
            <FoodForm 
              item={editingItem} 
              onSave={handleSave} 
              onCancel={() => { setDialogOpen(false); setEditingItem(undefined); }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate" data-testid={`text-food-name-${item.id}`}>{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category} - ${item.price}</p>
                  {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => { setEditingItem(item); setDialogOpen(true); }}
                    data-testid={`button-edit-food-${item.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => deleteMutation.mutate(item.id)}
                    data-testid={`button-delete-food-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No food items added yet. Click "Add Item" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function TournamentsTab() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LauncherTournament | undefined>();

  const { data: items = [], isLoading } = useQuery<LauncherTournament[]>({
    queryKey: ["/api/admin/launcher/tournaments"]
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/launcher/tournaments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/tournaments"] });
      toast({ title: "Tournament created successfully" });
      setDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/launcher/tournaments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/tournaments"] });
      toast({ title: "Tournament updated successfully" });
      setDialogOpen(false);
      setEditingItem(undefined);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/launcher/tournaments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/tournaments"] });
      toast({ title: "Tournament deleted successfully" });
    }
  });

  const handleSave = (data: any) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading tournaments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Manage tournaments displayed in the user launcher</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingItem(undefined); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-tournament">
              <Plus className="h-4 w-4 mr-2" />
              Add Tournament
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Tournament" : "Add New Tournament"}</DialogTitle>
            </DialogHeader>
            <TournamentForm 
              tournament={editingItem} 
              onSave={handleSave} 
              onCancel={() => { setDialogOpen(false); setEditingItem(undefined); }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-medium truncate" data-testid={`text-tournament-name-${item.id}`}>{item.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.game}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{item.date} at {item.time}</span>
                    {item.prizePool && <span className="text-green-500">{item.prizePool}</span>}
                  </div>
                  <p className="text-xs mt-1">
                    {item.currentParticipants}/{item.maxParticipants} participants
                    {item.entryFee && parseFloat(item.entryFee) > 0 && ` - $${item.entryFee} entry`}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => { setEditingItem(item); setDialogOpen(true); }}
                    data-testid={`button-edit-tournament-${item.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => deleteMutation.mutate(item.id)}
                    data-testid={`button-delete-tournament-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No tournaments added yet. Click "Add Tournament" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function RewardsTab() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LauncherReward | undefined>();

  const { data: items = [], isLoading } = useQuery<LauncherReward[]>({
    queryKey: ["/api/admin/launcher/rewards"]
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/launcher/rewards", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/rewards"] });
      toast({ title: "Reward created successfully" });
      setDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/launcher/rewards/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/rewards"] });
      toast({ title: "Reward updated successfully" });
      setDialogOpen(false);
      setEditingItem(undefined);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/launcher/rewards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/rewards"] });
      toast({ title: "Reward deleted successfully" });
    }
  });

  const handleSave = (data: any) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading rewards...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Manage rewards that users can redeem with points</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingItem(undefined); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-reward">
              <Plus className="h-4 w-4 mr-2" />
              Add Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Reward" : "Add New Reward"}</DialogTitle>
            </DialogHeader>
            <RewardForm 
              reward={editingItem} 
              onSave={handleSave} 
              onCancel={() => { setDialogOpen(false); setEditingItem(undefined); }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <Gift className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate" data-testid={`text-reward-name-${item.id}`}>{item.name}</h3>
                  <p className="text-sm text-yellow-500">{item.pointsCost} points</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => { setEditingItem(item); setDialogOpen(true); }}
                    data-testid={`button-edit-reward-${item.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => deleteMutation.mutate(item.id)}
                    data-testid={`button-delete-reward-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No rewards added yet. Click "Add Reward" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function AppsTab() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LauncherApp | undefined>();

  const { data: items = [], isLoading } = useQuery<LauncherApp[]>({
    queryKey: ["/api/admin/launcher/apps"]
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/launcher/apps", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/apps"] });
      toast({ title: "App created successfully" });
      setDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/launcher/apps/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/apps"] });
      toast({ title: "App updated successfully" });
      setDialogOpen(false);
      setEditingItem(undefined);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/launcher/apps/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/launcher/apps"] });
      toast({ title: "App deleted successfully" });
    }
  });

  const handleSave = (data: any) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading apps...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Manage apps available in the user launcher</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingItem(undefined); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-app">
              <Plus className="h-4 w-4 mr-2" />
              Add App
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit App" : "Add New App"}</DialogTitle>
            </DialogHeader>
            <AppForm 
              app={editingItem} 
              onSave={handleSave} 
              onCancel={() => { setDialogOpen(false); setEditingItem(undefined); }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                  <AppWindow className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate" data-testid={`text-app-name-${item.id}`}>{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => { setEditingItem(item); setDialogOpen(true); }}
                    data-testid={`button-edit-app-${item.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => deleteMutation.mutate(item.id)}
                    data-testid={`button-delete-app-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No apps added yet. Click "Add App" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

export default function LauncherSettings() {
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="heading-launcher-settings">Launcher Settings</h1>
          <p className="text-muted-foreground">
            Manage content displayed in the user launcher (ads are not editable)
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="games">
              <TabsList className="mb-6">
                <TabsTrigger value="games" className="gap-2" data-testid="tab-games">
                  <Gamepad2 className="h-4 w-4" />
                  Games
                </TabsTrigger>
                <TabsTrigger value="food" className="gap-2" data-testid="tab-food">
                  <UtensilsCrossed className="h-4 w-4" />
                  Food & Drinks
                </TabsTrigger>
                <TabsTrigger value="tournaments" className="gap-2" data-testid="tab-tournaments">
                  <Trophy className="h-4 w-4" />
                  Tournaments
                </TabsTrigger>
                <TabsTrigger value="rewards" className="gap-2" data-testid="tab-rewards">
                  <Gift className="h-4 w-4" />
                  Rewards
                </TabsTrigger>
                <TabsTrigger value="apps" className="gap-2" data-testid="tab-apps">
                  <AppWindow className="h-4 w-4" />
                  Apps
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games">
                <GamesTab />
              </TabsContent>
              <TabsContent value="food">
                <FoodTab />
              </TabsContent>
              <TabsContent value="tournaments">
                <TournamentsTab />
              </TabsContent>
              <TabsContent value="rewards">
                <RewardsTab />
              </TabsContent>
              <TabsContent value="apps">
                <AppsTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
