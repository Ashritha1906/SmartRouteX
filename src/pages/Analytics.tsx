
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTrafficData, getTrafficIncidents, getTrafficSummary } from "@/lib/traffic-service";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("week");
  
  const { data: trafficSummary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["trafficSummary"],
    queryFn: getTrafficSummary
  });
  
  const { data: trafficData } = useQuery({
    queryKey: ["trafficData"],
    queryFn: getTrafficData
  });
  
  const { data: incidents } = useQuery({
    queryKey: ["incidents"],
    queryFn: getTrafficIncidents
  });
  
  // Generate sample historical data
  const generateHistoricalData = (days: number) => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString(),
        congestion: Math.floor(Math.random() * 70) + 30,
        incidents: Math.floor(Math.random() * 8),
      });
    }
    
    return data.reverse();
  };
  
  const weeklyData = generateHistoricalData(7);
  const monthlyData = generateHistoricalData(30);
  
  const trafficByStatus = trafficData?.reduce((acc: any, item: any) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  
  const trafficByHour = [
    { hour: "00:00", congestion: 15 },
    { hour: "03:00", congestion: 12 },
    { hour: "06:00", congestion: 45 },
    { hour: "09:00", congestion: 85 },
    { hour: "12:00", congestion: 65 },
    { hour: "15:00", congestion: 72 },
    { hour: "18:00", congestion: 90 },
    { hour: "21:00", congestion: 40 },
  ];
  
  const incidentTypes = incidents?.reduce((acc: any, incident: any) => {
    acc[incident.type] = (acc[incident.type] || 0) + 1;
    return acc;
  }, {});
  
  const incidentTypesData = incidentTypes ? Object.keys(incidentTypes).map(type => ({
    name: type,
    value: incidentTypes[type]
  })) : [];
  
  return (
    <PageLayout title="Traffic Analytics Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Traffic Insights Overview</h2>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Congestion</CardTitle>
              <CardDescription>City-wide traffic congestion levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{trafficSummary?.avgCongestion.toFixed(1) || "Loading..."}%</div>
              <p className="text-muted-foreground">
                {trafficSummary?.avgCongestion > 60 ? "Heavy traffic conditions" : 
                 trafficSummary?.avgCongestion > 30 ? "Moderate traffic conditions" : 
                 "Light traffic conditions"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Incidents</CardTitle>
              <CardDescription>Current unresolved traffic incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{trafficSummary?.activeIncidents || "Loading..."}</div>
              <p className="text-muted-foreground">Affecting traffic flow</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Most Congested Area</CardTitle>
              <CardDescription>Location with highest traffic density</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{trafficSummary?.mostCongestedLocation || "Loading..."}</div>
              <p className="text-muted-foreground">{trafficSummary?.mostCongestedLevel}% congestion</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="congestion" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="congestion">Congestion Trends</TabsTrigger>
            <TabsTrigger value="incidents">Incident Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="congestion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Congestion Over Time</CardTitle>
                <CardDescription>
                  {timeRange === "day" ? "Last 24 Hours" : 
                   timeRange === "week" ? "Last 7 Days" : "Last 30 Days"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeRange === "week" ? weeklyData : monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Congestion %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="congestion" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traffic Distribution by Hour</CardTitle>
                <CardDescription>Average congestion levels throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficByHour}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="congestion" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="incidents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Incidents by Type</CardTitle>
                <CardDescription>Distribution of traffic incident categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incidentTypesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Incident Timeline</CardTitle>
                <CardDescription>Incidents over the selected time period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeRange === "week" ? weeklyData : monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="incidents" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Analytics;
