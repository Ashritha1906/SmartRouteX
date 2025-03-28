
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Info, RefreshCw, Link, AlertTriangle } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-sonner";
import { getTrafficData, getTrafficIncidents, getTrafficSignals } from "@/lib/traffic-service";

const DataSources = () => {
  const [refreshing, setRefreshing] = useState<string | null>(null);
  
  // Simulate data source connections
  const dataSources = [
    {
      id: "traffic-api",
      name: "Traffic API",
      type: "REST API",
      status: "active",
      lastSynced: "2 minutes ago",
      dataPoints: "Traffic flow, congestion levels",
      details: {
        endpoint: "https://api.smartroutex.io/traffic",
        refreshRate: "30 seconds",
        dataFormat: "JSON"
      }
    },
    {
      id: "cctv",
      name: "CCTV Cameras",
      type: "Video Feed",
      status: "active",
      lastSynced: "1 minute ago",
      dataPoints: "Visual traffic monitoring, incident detection",
      details: {
        cameras: 48,
        coverage: "Major intersections",
        resolution: "1080p"
      }
    },
    {
      id: "sensors",
      name: "Road Sensors",
      type: "IoT Devices",
      status: "active",
      lastSynced: "5 minutes ago",
      dataPoints: "Vehicle count, speed, road conditions",
      details: {
        sensors: 124,
        coverage: "Main highways and roads",
        batteryStatus: "87% average"
      }
    },
    {
      id: "weather",
      name: "Weather Service",
      type: "REST API",
      status: "active",
      lastSynced: "15 minutes ago",
      dataPoints: "Temperature, precipitation, wind",
      details: {
        provider: "MeteoCity API",
        refreshRate: "15 minutes",
        dataFormat: "JSON"
      }
    },
    {
      id: "google-maps",
      name: "Google Maps API",
      type: "REST API",
      status: "warning",
      lastSynced: "32 minutes ago",
      dataPoints: "Travel time, route information",
      details: {
        endpoint: "https://maps.googleapis.com/maps/api",
        refreshRate: "5 minutes",
        dataFormat: "JSON"
      }
    },
    {
      id: "traffic-lights",
      name: "Traffic Signal Controls",
      type: "Control System",
      status: "active",
      lastSynced: "3 minutes ago",
      dataPoints: "Signal timing, status, operations",
      details: {
        signals: 87,
        coverage: "City traffic lights",
        controlSystem: "SmartSignal v3"
      }
    },
  ];
  
  // Data integrity stats
  const dataIntegrity = {
    completeness: 96.5,
    accuracy: 98.2,
    consistency: 94.7,
    timeliness: 99.1
  };
  
  // Simulate data freshness
  const systemStats = {
    uptime: "99.8%",
    latency: "120ms",
    requests: "1.2M/day",
    errorRate: "0.03%",
    dataSize: "8.4 GB"
  };
  
  // Fetch traffic data using queries to test connections
  const { refetch: refetchTrafficData, isLoading: isLoadingTraffic } = useQuery({
    queryKey: ["trafficData"],
    queryFn: getTrafficData,
    enabled: false
  });
  
  const { refetch: refetchIncidents, isLoading: isLoadingIncidents } = useQuery({
    queryKey: ["incidents"],
    queryFn: getTrafficIncidents,
    enabled: false
  });
  
  const { refetch: refetchSignals, isLoading: isLoadingSignals } = useQuery({
    queryKey: ["signals"],
    queryFn: getTrafficSignals,
    enabled: false
  });
  
  const handleRefresh = (sourceId: string) => {
    setRefreshing(sourceId);
    
    // Simulate API calls based on the source
    let refetchPromise;
    
    if (sourceId === "traffic-api") {
      refetchPromise = refetchTrafficData();
    } else if (sourceId === "cctv") {
      refetchPromise = refetchIncidents();
    } else if (sourceId === "traffic-lights") {
      refetchPromise = refetchSignals();
    } else {
      // Mock refresh for other sources
      refetchPromise = new Promise((resolve) => setTimeout(resolve, 1500));
    }
    
    refetchPromise
      .then(() => {
        toast.success(`${dataSources.find(s => s.id === sourceId)?.name} data refreshed successfully`);
      })
      .catch(() => {
        toast.error(`Failed to refresh ${dataSources.find(s => s.id === sourceId)?.name} data`);
      })
      .finally(() => {
        setRefreshing(null);
      });
  };
  
  return (
    <PageLayout title="Data Sources & Connections">
      <div className="space-y-6">
        <Tabs defaultValue="sources">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="stats">System Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">Total Sources</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of connected data sources</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dataSources.length}</div>
                  <p className="text-sm text-muted-foreground">Active integrations</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Data Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">97.1%</div>
                  <p className="text-sm text-muted-foreground">Overall data quality score</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Last Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">2 minutes ago</div>
                  <p className="text-sm text-muted-foreground">System-wide refresh</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map((source) => (
                <Card key={source.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <Badge variant={source.status === 'active' ? 'default' : 'destructive'}>
                        {source.status === 'active' ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {source.status}
                      </Badge>
                    </div>
                    <CardDescription>{source.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last synced:</span>
                        <span className="text-sm">{source.lastSynced}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Data points:</span>
                        <p className="text-sm">{source.dataPoints}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => handleRefresh(source.id)}
                      disabled={refreshing === source.id}
                    >
                      {refreshing === source.id ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Refresh
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs"
                    >
                      <Link className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Integrity Metrics</CardTitle>
                  <CardDescription>Quality metrics for all data sources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Completeness</span>
                      <span className="text-sm">{dataIntegrity.completeness}%</span>
                    </div>
                    <Progress value={dataIntegrity.completeness} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Accuracy</span>
                      <span className="text-sm">{dataIntegrity.accuracy}%</span>
                    </div>
                    <Progress value={dataIntegrity.accuracy} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Consistency</span>
                      <span className="text-sm">{dataIntegrity.consistency}%</span>
                    </div>
                    <Progress value={dataIntegrity.consistency} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Timeliness</span>
                      <span className="text-sm">{dataIntegrity.timeliness}%</span>
                    </div>
                    <Progress value={dataIntegrity.timeliness} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Current performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">System Uptime</p>
                      <p className="text-xl font-semibold">{systemStats.uptime}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg. Latency</p>
                      <p className="text-xl font-semibold">{systemStats.latency}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Daily Requests</p>
                      <p className="text-xl font-semibold">{systemStats.requests}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Error Rate</p>
                      <p className="text-xl font-semibold">{systemStats.errorRate}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Data Size</p>
                      <p className="text-xl font-semibold">{systemStats.dataSize}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Detailed Analytics
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Pipeline Health</CardTitle>
                <CardDescription>Current status of data processing pipelines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">Ingestion</Badge>
                      <span>Data collection and ingestion layer</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">Healthy</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">Processing</Badge>
                      <span>Data transformation and processing</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">Healthy</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">Analytics</Badge>
                      <span>Data analysis and insights generation</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">Healthy</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">Visualization</Badge>
                      <span>Dashboard and UI data delivery</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500 text-white">Warning</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">Storage</Badge>
                      <span>Long-term data storage and archiving</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DataSources;
