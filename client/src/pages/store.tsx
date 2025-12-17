import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Coffee, Pizza, CreditCard, Trash2, Plus, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Store() {
  const products = [
    { id: 1, name: "Red Bull Energy", price: 4.50, category: "Drinks", color: "bg-blue-500/20", icon: Coffee },
    { id: 2, name: "Coca Cola", price: 2.50, category: "Drinks", color: "bg-red-500/20", icon: Coffee },
    { id: 3, name: "Pepperoni Pizza", price: 12.00, category: "Food", color: "bg-orange-500/20", icon: Pizza },
    { id: 4, name: "Chips (Lays)", price: 3.00, category: "Snacks", color: "bg-yellow-500/20", icon: Pizza },
    { id: 5, name: "1 Hour Pass", price: 5.00, category: "Time", color: "bg-primary/20", icon: ClockIcon },
    { id: 6, name: "3 Hour Pass", price: 12.00, category: "Time", color: "bg-primary/20", icon: ClockIcon },
    { id: 7, name: "Day Pass", price: 25.00, category: "Time", color: "bg-primary/20", icon: ClockIcon },
    { id: 8, name: "Instant Noodles", price: 4.00, category: "Food", color: "bg-yellow-600/20", icon: Pizza },
  ];

  function ClockIcon(props: any) { return <CreditCard {...props} /> } // Placeholder

  return (
    <MainLayout title="Store & POS">
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        
        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {["All", "Drinks", "Food", "Snacks", "Time", "Merch"].map((cat) => (
              <Button key={cat} variant={cat === "All" ? "default" : "outline"} className={cat === "All" ? "bg-primary text-white" : "border-white/10 text-muted-foreground hover:text-white"}>
                {cat}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="bg-card border-border/50 hover:border-primary/50 cursor-pointer group transition-all">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`h-24 w-24 rounded-full ${product.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <product.icon className="h-10 w-10 text-white/80" />
                  </div>
                  <h3 className="font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-primary font-mono font-bold text-lg">${product.price.toFixed(2)}</p>
                  <Button size="sm" className="w-full mt-3 bg-white/5 hover:bg-primary hover:text-white transition-colors">Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="w-96 bg-card border border-border rounded-xl flex flex-col shadow-2xl">
          <div className="p-4 border-b border-border bg-white/5">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" /> Current Order
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-4">
              {[
                { name: "Red Bull Energy", price: 4.50, qty: 2 },
                { name: "Pepperoni Pizza", price: 12.00, qty: 1 },
                { name: "1 Hour Pass", price: 5.00, qty: 1 },
                { name: "Coca Cola", price: 2.50, qty: 3 },
                { name: "Chips (Lays)", price: 3.00, qty: 2 },
                { name: "3 Hour Pass", price: 12.00, qty: 1 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                    <button className="h-6 w-6 flex items-center justify-center hover:bg-white/10 rounded"><Minus className="h-3 w-3" /></button>
                    <span className="text-sm font-mono w-4 text-center">{item.qty}</span>
                    <button className="h-6 w-6 flex items-center justify-center hover:bg-white/10 rounded"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="ml-2 font-mono font-bold text-white whitespace-nowrap">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border bg-white/5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>$26.00</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (10%)</span>
                <span>$2.60</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span className="text-primary">$28.60</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                 <Trash2 className="h-4 w-4 mr-2" /> Clear
               </Button>
               <Button className="bg-primary text-white hover:bg-primary/90">
                 Checkout
               </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
