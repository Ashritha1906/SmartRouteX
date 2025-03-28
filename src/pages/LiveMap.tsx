import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockLocations } from "@/lib/mock-data";
import { Map, Layers, AlertTriangle, Signal } from "lucide-react";

// Google Maps type definitions
interface GoogleMap {
  Map: new (element: HTMLElement, options: MapOptions) => MapInstance;
  TrafficLayer: new () => TrafficLayerInstance;
  Marker: new (options: MarkerOptions) => MarkerInstance;
  SymbolPath: {
    CIRCLE: string;
  };
}

interface MapInstance {
  setCenter(latLng: LatLng): void;
  setZoom(zoom: number): void;
  setMapTypeId(type: string): void;
}

interface TrafficLayerInstance {
  setMap(map: MapInstance | null): void;
  getMap(): MapInstance | null;
}

interface MarkerInstance {
  setMap(map: MapInstance | null): void;
  setPosition(position: LatLng): void;
  setTitle(title: string): void;
  setIcon(icon: IconOptions): void;
}

interface MapOptions {
  center: LatLng;
  zoom: number;
  mapTypeId: string;
  styles?: MapStyle[];
}

interface LatLng {
  lat: number;
  lng: number;
}

interface MapStyle {
  featureType: string;
  elementType: string;
  stylers: { [key: string]: any }[];
}

interface MarkerOptions {
  position: LatLng;
  map: MapInstance;
  title: string;
  icon?: IconOptions;
}

interface IconOptions {
  path: string;
  scale: number;
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWeight: number;
}

declare global {
  interface Window {
    google: {
      maps: GoogleMap;
    };
  }
}

const LiveMap = () => {
  const [selectedTab, setSelectedTab] = useState("traffic");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapInstance | null>(null);
  const markersRef = useRef<MarkerInstance[]>([]);
  const trafficLayerRef = useRef<TrafficLayerInstance | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mapRef.current && window.google) {
      // Initialize map centered on Tuticorin
      const tuticorin = { lat: 8.7642, lng: 78.1348 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: tuticorin,
        zoom: 13,
        mapTypeId: "roadmap",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add traffic layer
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(map);
      trafficLayerRef.current = trafficLayer;

      // Add markers for mock locations
      const markers = mockLocations.map(location => {
        return new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#FF0000",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2
          }
        });
      });

      markersRef.current = markers;
    }

    // Cleanup function
    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, []);

  const toggleTrafficLayer = () => {
    if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(
        trafficLayerRef.current.getMap() ? null : mapInstanceRef.current
      );
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    if (value === "incidents") {
      navigate("/incidents");
    } else if (value === "signals") {
      navigate("/traffic-signals");
    }
  };

  return (
    <PageLayout title="Live Traffic Map">
      <div className="mb-4">
        <Tabs 
          defaultValue="traffic" 
          value={selectedTab}
          onValueChange={handleTabChange}
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
              <Button variant="outline" size="sm" onClick={toggleTrafficLayer}>
                <Layers className="h-4 w-4 mr-2" />
                Toggle Traffic Layer
              </Button>
              <Button variant="outline" size="sm">
                Last updated: {new Date().toLocaleTimeString()}
              </Button>
            </div>
          </div>

          <TabsContent value="traffic" className="mt-4">
            <Card className="relative min-h-[70vh]">
              <CardContent className="p-0">
                <div ref={mapRef} className="w-full h-[70vh]" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="incidents" className="mt-4">
            <Card className="relative min-h-[70vh] bg-slate-100">
              <CardContent className="p-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Redirecting to Incidents...</h3>
                    <p className="text-muted-foreground">
                      Please wait while we take you to the incidents page.
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
                    <h3 className="text-xl font-semibold mb-2">Redirecting to Traffic Signals...</h3>
                    <p className="text-muted-foreground">
                      Please wait while we take you to the traffic signals page.
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
