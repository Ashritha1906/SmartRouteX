
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockLocations } from "@/lib/mock-data";
import { Map, Layers, AlertTriangle, Signal } from "lucide-react";

const LiveMap = () => {
  const [selectedTab, setSelectedTab] = useState("traffic");

  return (
    <PageLayout title="Live Traffic Map">
      <div className="mb-4">
        <Tabs 
          defaultValue="traffic" 
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="traffic">
                <Map className="h-4 w-4 mr-2" />
                Traffic Flow
              </TabsTrigger>
              <TabsTrigger value="incidents">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Incidents
              </TabsTrigger>
              <TabsTrigger value="signals">
                <Signal className="h-4 w-4 mr-2" />
                Traffic Signals
              </TabsTrigger>
            </TabsList>
            
            <div className="hidden md:flex space-x-2">
              <Button variant="outline" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                Layers
              </Button>
              <Button variant="outline" size="sm">
                Last updated: {new Date().toLocaleTimeString()}
              </Button>
            </div>
          </div>

          <TabsContent value="traffic" className="mt-4">
            <Card className="relative min-h-[70vh] bg-slate-100">
              <CardContent className="p-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="absolute inset-0 bg-brand-primary/10 rounded-full animate-ping"></div>
                      <div className="relative flex items-center justify-center w-32 h-32 bg-white rounded-full shadow">
                        <Map className="h-16 w-16 text-brand-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Live Map Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Google Maps API integration will enable real-time traffic visualization.
                    </p>
                    
                    <div className="mt-8 p-3 bg-brand-primary/10 rounded-md text-sm text-brand-primary inline-block">
                      Check out these locations in Tuticorin:
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        {mockLocations.slice(0, 6).map(location => (
                          <div key={location.id} className="px-2 py-1 bg-white rounded">
                            {location.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="incidents" className="mt-4">
            <Card className="relative min-h-[70vh] bg-slate-100">
              <CardContent className="p-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Incident Map Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Visual representation of accidents, roadblocks, and other incidents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signals" className="mt-4">
            <Card className="relative min-h-[70vh] bg-slate-100">
              <CardContent className="p-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Signal className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Signal Control Map Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Interactive map to monitor and control traffic signals throughout the city.
                    </p>
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

export default LiveMap;
