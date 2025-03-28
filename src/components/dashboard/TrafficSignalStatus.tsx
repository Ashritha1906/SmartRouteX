
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getTrafficSignals, 
  getLocationById, 
  optimizeTrafficSignal 
} from "@/lib/traffic-service";
import { TrafficSignal } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TrafficSignalStatus = () => {
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [optimizingId, setOptimizingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setIsLoading(true);
        const data = await getTrafficSignals();
        // Sort to show non-optimized first
        const sortedSignals = [...data].sort((a, b) => {
          if (a.isOptimized === b.isOptimized) return 0;
          return a.isOptimized ? 1 : -1;
        });
        setSignals(sortedSignals.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch signal data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignals();
    
    // Update every 10 seconds
    const interval = setInterval(fetchSignals, 10000);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Traffic Signal Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {signals.map((signal) => {
              const location = getLocationById(signal.locationId);
              return (
                <div key={signal.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{location?.name || "Unknown Junction"}</div>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge 
                        className={
                          signal.currentPhase === "green" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          signal.currentPhase === "yellow" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {signal.currentPhase.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {signal.nextPhaseIn}s → {
                          signal.currentPhase === "green" ? "yellow" :
                          signal.currentPhase === "yellow" ? "red" : "green"
                        }
                      </span>
                      {signal.isOptimized && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Optimized
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={signal.isOptimized ? "outline" : "default"}
                    onClick={() => handleOptimize(signal.id)}
                    disabled={optimizingId === signal.id}
                    className={signal.isOptimized ? "text-muted-foreground" : ""}
                  >
                    {optimizingId === signal.id ? (
                      <span className="flex items-center">
                        <span className="h-3 w-3 mr-2 rounded-full bg-current opacity-75 animate-ping"></span>
                        Optimizing...
                      </span>
                    ) : (
                      signal.isOptimized ? "Re-optimize" : "Optimize"
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficSignalStatus;
