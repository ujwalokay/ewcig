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
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [realName, setRealName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("Bronze");

  const createMemberMutation = useMutation({
    mutationFn: async (data: { username: string; realName: string; email?: string; tier: string }) => {
      return apiRequest("POST", "/api/members", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      setOpen(false);
      setUsername("");
      setRealName("");
      setEmail("");
      setTier("Bronze");
      toast({
        title: "Member Added",
        description: "New member account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create member",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !realName) {
      toast({
        title: "Error",
        description: "Username and full name are required",
        variant: "destructive",
      });
      return;
    }
    createMemberMutation.mutate({ username, realName, email: email || undefined, tier });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white" data-testid="button-add-member">
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="input-member-username"
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
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              data-testid="input-member-realname"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-member-email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tier" className="text-right">
              Tier
            </Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger className="col-span-3 bg-white/5 border-white/10" data-testid="select-member-tier">
                <SelectValue placeholder="Select a tier" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-white">
                <SelectItem value="Bronze">Bronze (Standard)</SelectItem>
                <SelectItem value="Silver">Silver (VIP)</SelectItem>
                <SelectItem value="Gold">Gold (Elite)</SelectItem>
                <SelectItem value="Platinum">Platinum (Legend)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            className="bg-primary text-white"
            disabled={createMemberMutation.isPending}
            data-testid="button-create-member"
          >
            {createMemberMutation.isPending ? "Creating..." : "Create Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
