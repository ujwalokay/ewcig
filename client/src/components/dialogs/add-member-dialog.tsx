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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    toast({
      title: "Member Added",
      description: "New member account has been created successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-white">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new member account. They will be able to log in immediately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              placeholder="GamerTag123"
              className="col-span-3 bg-white/5 border-white/10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              className="col-span-3 bg-white/5 border-white/10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="col-span-3 bg-white/5 border-white/10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tier" className="text-right">
              Tier
            </Label>
            <Select defaultValue="bronze">
              <SelectTrigger className="col-span-3 bg-white/5 border-white/10">
                <SelectValue placeholder="Select a tier" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-white">
                <SelectItem value="bronze">Bronze (Standard)</SelectItem>
                <SelectItem value="silver">Silver (VIP)</SelectItem>
                <SelectItem value="gold">Gold (Elite)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white">Create Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
