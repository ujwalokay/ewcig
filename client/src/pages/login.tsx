import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import generatedImage from '@assets/generated_images/futuristic_gaming_cafe_interior_concept_art.png'

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-body">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{ 
          backgroundImage: `url(${generatedImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }} 
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0 cyber-grid opacity-20" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-display font-bold text-3xl skew-x-[-10deg] shadow-[0_0_30px_rgba(255,107,0,0.5)] mb-4">
            G
          </div>
          <h1 className="font-display text-4xl font-bold text-white tracking-wider mb-2">GGCIRCUIT</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">Command Center Access</p>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">System Login</CardTitle>
            <CardDescription>Enter your credentials to access the terminal.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="admin" 
                  className="bg-black/20 border-white/10 focus:border-primary/50" 
                  defaultValue="admin"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:text-primary/80">Forgot password?</a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-black/20 border-white/10 focus:border-primary/50"
                  defaultValue="password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "INITIALIZE SESSION"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            SYSTEM VERSION 2.4.0 • SECURE CONNECTION
          </p>
        </div>
      </div>
    </div>
  );
}
