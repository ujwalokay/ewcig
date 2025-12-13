import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

export default function Reports() {
  const data = [
    { name: "Mon", revenue: 4000, usage: 2400 },
    { name: "Tue", revenue: 3000, usage: 1398 },
    { name: "Wed", revenue: 2000, usage: 9800 },
    { name: "Thu", revenue: 2780, usage: 3908 },
    { name: "Fri", revenue: 1890, usage: 4800 },
    { name: "Sat", revenue: 2390, usage: 3800 },
    { name: "Sun", revenue: 3490, usage: 4300 },
  ];

  return (
    <MainLayout 
      title="Analytics & Reports"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-white">
            <Calendar className="h-4 w-4 mr-2" /> Last 7 Days
          </Button>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white">Utilization Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                       itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="usage" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
