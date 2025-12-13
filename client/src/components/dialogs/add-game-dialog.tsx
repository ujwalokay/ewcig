import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function AddGameDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    toast({
      title: "Game Added",
      description: "New game has been added to the library.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Add Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-white">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new title to the games library manually.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Game Title"
              className="col-span-3 bg-white/5 border-white/10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              placeholder="FPS, MOBA, RPG..."
              className="col-span-3 bg-white/5 border-white/10"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image URL
            </Label>
            <Input
              id="image"
              placeholder="https://..."
              className="col-span-3 bg-white/5 border-white/10"
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white">Add to Library</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
