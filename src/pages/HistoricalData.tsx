
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const HistoricalData = () => {
  const [dataType, setDataType] = useState("congestion");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState("all");
  
  // Generate sample historical data
  const generateDailyData = (days: number, forLocation?: string) => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: format(date, "MMM dd"),
        congestion: Math.floor(Math.random() * 70) + 30,
        incidents: Math.floor(Math.random() * 8),
        violations: Math.floor(Math.random() * 12),
        volume: Math.floor(Math.random() * 8000) + 2000,
      });
    }
    
    return data.reverse();
  };
  
  const generateHourlyData = (hours: number) => {
    const data = [];
    
    for (let i = 0; i < hours; i++) {
      data.push({
        time: `${String(i).padStart(2, '0')}:00`,
        congestion: Math.floor(Math.random() * 70) + 30,
        incidents: Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
        violations: Math.random() < 0.4 ? Math.floor(Math.random() * 5) + 1 : 0,
        volume: Math.floor(Math.random() * 1500) + 500,
      });
    }
    
    return data;
  };
  
  const monthlyData = generateDailyData(30);
  const hourlyData = generateHourlyData(24);
  
  // Sample locations
  const locations = [
    { id: "all", name: "All Locations" },
    { id: "downtown", name: "Downtown" },
    { id: "northside", name: "North Side" },
    { id: "eastside", name: "East Side" },
    { id: "westside", name: "West Side" },
    { id: "southside", name: "South Side" },
  ];
  
  return (
    <PageLayout title="Historical Traffic Data">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <Tabs 
            defaultValue="daily" 
            className="w-full md:w-auto"
            onValueChange={(value) => console.log(value)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="hourly">Hourly View</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date > new Date() || date < subDays(new Date(), 365)}
                />
              </PopoverContent>
            </Popover>
            
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="congestion">Congestion</SelectItem>
                <SelectItem value="incidents">Incidents</SelectItem>
                <SelectItem value="violations">Violations</SelectItem>
                <SelectItem value="volume">Traffic Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>
                {dataType === "congestion" ? "Traffic Congestion" : 
                 dataType === "incidents" ? "Traffic Incidents" :
                 dataType === "violations" ? "Traffic Violations" : "Traffic Volume"}
              </span>
            </CardTitle>
            <CardDescription>
              {location === "all" ? "All areas" : locations.find(l => l.id === location)?.name} • 
              {date ? format(date, " MMMM yyyy") : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {dataType === "congestion" ? (
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="congestion" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                ) : dataType === "incidents" ? (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="incidents" fill="#82ca9d" />
                  </BarChart>
                ) : dataType === "violations" ? (
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="violations" stroke="#ffc658" />
                  </LineChart>
                ) : (
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="volume" stroke="#ff7300" fill="#ff7300" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Statistics</CardTitle>
              <CardDescription>
                Key traffic metrics for {date ? format(date, "MMM dd, yyyy") : "today"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Peak Congestion</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 30) + 70}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Average Congestion</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 20) + 40}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Incidents</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 8) + 1}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">{(Math.floor(Math.random() * 50) + 50).toLocaleString()}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Traffic Trends</CardTitle>
              <CardDescription>Comparison with previous periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">vs. Previous Day</span>
                  <div className={cn(
                    "flex items-center text-sm font-medium",
                    Math.random() > 0.5 ? "text-green-500" : "text-red-500"
                  )}>
                    {Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 15).toFixed(1)}%
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">vs. Previous Week</span>
                  <div className={cn(
                    "flex items-center text-sm font-medium",
                    Math.random() > 0.5 ? "text-green-500" : "text-red-500"
                  )}>
                    {Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 22).toFixed(1)}%
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">vs. Previous Month</span>
                  <div className={cn(
                    "flex items-center text-sm font-medium",
                    Math.random() > 0.5 ? "text-green-500" : "text-red-500"
                  )}>
                    {Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 30).toFixed(1)}%
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">vs. Same Day Last Year</span>
                  <div className={cn(
                    "flex items-center text-sm font-medium",
                    Math.random() > 0.5 ? "text-green-500" : "text-red-500"
                  )}>
                    {Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 45).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default HistoricalData;
