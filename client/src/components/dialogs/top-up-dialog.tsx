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
import { CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface TopUpDialogProps {
  memberId?: string;
  memberName?: string;
}

export function TopUpDialog({ memberId, memberName }: TopUpDialogProps) {
  const [open, setOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const topUpMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!memberId) throw new Error("No member selected");
      return apiRequest("POST", `/api/members/${memberId}/topup`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      setOpen(false);
      setCustomAmount("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to top up balance",
        variant: "destructive",
      });
    }
  });

  const handleTopUp = (amount: string) => {
    topUpMutation.mutate(amount, {
      onSuccess: () => {
        toast({
          title: "Balance Updated",
          description: `Successfully added $${amount} to ${memberName || "user"}'s account.`,
        });
      }
    });
  };

  const handleCustomTopUp = () => {
    if (!customAmount || isNaN(parseFloat(customAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    handleTopUp(parseFloat(customAmount).toFixed(2));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-white/5 text-primary" data-testid={memberId ? `button-topup-${memberId}` : "button-topup"}>
          Top Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-white">
        <DialogHeader>
          <DialogTitle>Top Up Balance</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add funds to {memberName || "member"}'s account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="border-white/10" 
              onClick={() => handleTopUp("5.00")}
              disabled={topUpMutation.isPending}
              data-testid="button-topup-5"
            >
              $5.00
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10" 
              onClick={() => handleTopUp("10.00")}
              disabled={topUpMutation.isPending}
              data-testid="button-topup-10"
            >
              $10.00
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10" 
              onClick={() => handleTopUp("20.00")}
              disabled={topUpMutation.isPending}
              data-testid="button-topup-20"
            >
              $20.00
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10" 
              onClick={() => handleTopUp("50.00")}
              disabled={topUpMutation.isPending}
              data-testid="button-topup-50"
            >
              $50.00
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10" 
              onClick={() => handleTopUp("100.00")}
              disabled={topUpMutation.isPending}
              data-testid="button-topup-100"
            >
              $100.00
            </Button>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="custom-amount" className="text-right">
              Custom
            </Label>
            <div className="col-span-3 relative">
               <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                id="custom-amount"
                placeholder="0.00"
                className="pl-9 bg-white/5 border-white/10"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                data-testid="input-topup-custom"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleCustomTopUp} 
            className="bg-primary text-white w-full"
            disabled={topUpMutation.isPending || !customAmount}
            data-testid="button-topup-process"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {topUpMutation.isPending ? "Processing..." : "Process Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
