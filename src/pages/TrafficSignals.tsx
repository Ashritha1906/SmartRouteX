
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  getTrafficSignals, 
  getLocationById, 
  optimizeTrafficSignal 
} from "@/lib/traffic-service";
import { TrafficSignal } from "@/lib/mock-data";
import { toast } from "sonner";
import { RefreshCw, Settings } from "lucide-react";

const TrafficSignals = () => {
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizingId, setOptimizingId] = useState<number | null>(null);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const data = await getTrafficSignals();
      setSignals(data);
    } catch (error) {
      console.error("Failed to fetch signals:", error);
      toast.error("Failed to load traffic signals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchSignals, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimize = async (signalId: number) => {
    try {
      setOptimizingId(signalId);
      const updatedSignal = await optimizeTrafficSignal(signalId);
      
      // Update the signals state with the optimized signal
      setSignals(prevSignals => 
        prevSignals.map(signal => 
          signal.id === signalId ? updatedSignal : signal
        )
      );
      
      toast.success("Traffic signal optimized successfully");
    } catch (error) {
      console.error("Failed to optimize signal:", error);
      toast.error("Failed to optimize traffic signal");
    } finally {
      setOptimizingId(null);
    }
  };

  const handleRefresh = () => {
    fetchSignals();
    toast.success("Traffic signal data refreshed");
  };

  return (
    <PageLayout title="Traffic Signal Management">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Traffic Signals</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 animate-pulse rounded w-full"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Phase</TableHead>
                  <TableHead>Cycle Time</TableHead>
                  <TableHead>Optimization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signals.map((signal) => {
                  const location = getLocationById(signal.locationId);
                  return (
                    <TableRow key={signal.id}>
                      <TableCell className="font-medium">{location?.name || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            signal.currentPhase === "green" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                            signal.currentPhase === "yellow" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                            "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {signal.currentPhase.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {signal.nextPhaseIn}s → {
                          signal.currentPhase === "green" ? "yellow" :
                          signal.currentPhase === "yellow" ? "red" : "green"
                        }
                      </TableCell>
                      <TableCell>{signal.cycleTime}s</TableCell>
                      <TableCell>
                        {signal.isAdaptive ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Adaptive
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">
                            Fixed
                          </Badge>
                        )}
                        {signal.isOptimized && (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                            Optimized
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOptimize(signal.id)}
                            disabled={optimizingId === signal.id}
                          >
                            {optimizingId === signal.id ? (
                              <>
                                <span className="h-3 w-3 mr-2 rounded-full bg-current opacity-75 animate-ping"></span>
                                Optimizing...
                              </>
                            ) : (
                              <>
                                {signal.isOptimized ? "Re-optimize" : "Optimize"}
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Smart Signal Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The AI-powered signal control system automatically adjusts traffic light timing based on real-time traffic conditions.
                Signals can be manually optimized during special events or emergency situations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800 mb-2">Adaptive Control</h3>
                  <p className="text-sm text-green-700">
                    Automatically adjusts signal timing based on current traffic flow and vehicle counts.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Emergency Priority</h3>
                  <p className="text-sm text-blue-700">
                    Automatically detects emergency vehicles and provides priority green signals.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-2">AI Optimization</h3>
                  <p className="text-sm text-purple-700">
                    Uses historical patterns and predictive algorithms to optimize signal timing.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TrafficSignals;
