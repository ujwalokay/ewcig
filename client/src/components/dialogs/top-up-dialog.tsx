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

export function TopUpDialog() {
  const [open, setOpen] = useState(false);

  const handleTopUp = (amount: string) => {
    setOpen(false);
    toast({
      title: "Balance Updated",
      description: `Successfully added $${amount} to user account.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-white/5 hover:bg-white/10 text-primary">Top Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-white">
        <DialogHeader>
          <DialogTitle>Top Up Balance</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add funds to member account manually.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50" onClick={() => handleTopUp("5.00")}>$5.00</Button>
            <Button variant="outline" className="border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50" onClick={() => handleTopUp("10.00")}>$10.00</Button>
            <Button variant="outline" className="border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50" onClick={() => handleTopUp("20.00")}>$20.00</Button>
            <Button variant="outline" className="border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50" onClick={() => handleTopUp("50.00")}>$50.00</Button>
            <Button variant="outline" className="border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50" onClick={() => handleTopUp("100.00")}>$100.00</Button>
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
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => handleTopUp("Custom")} className="bg-primary hover:bg-primary/90 text-white w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
