import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Map, Layers, AlertTriangle, Signal, RefreshCw } from "lucide-react";
import { getLatestTrafficData, getActiveIncidents, getTrafficSignals, updateTrafficSimulation } from "@/services/real-time-service";
import { supabase } from "@/integrations/supabase/client";
import type { TrafficData, TrafficIncident, TrafficSignal } from "@/services/real-time-service";

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different traffic statuses
const createTrafficIcon = (status: string) => {
  const color = status === 'smooth' ? '#22c55e' : 
               status === 'moderate' ? '#f59e0b' : 
               status === 'heavy' ? '#ef4444' : '#dc2626';
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
    className: 'traffic-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const incidentIcon = L.divIcon({
  html: '<div style="background-color: #dc2626; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">!</div>',
  className: 'incident-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const signalIcon = L.divIcon({
  html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 2px; border: 1px solid white;"></div>',
  className: 'signal-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const LiveMap = () => {
  const [selectedTab, setSelectedTab] = useState("traffic");
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Fetch real-time data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [trafficResult, incidentResult, signalResult] = await Promise.all([
        getLatestTrafficData(),
        getActiveIncidents(),
        getTrafficSignals()
      ]);
      
      setTrafficData(trafficResult);
      setIncidents(incidentResult);
      setSignals(signalResult);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger traffic simulation update
  const handleSimulationUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateTrafficSimulation();
      await fetchData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating simulation:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions
    const trafficChannel = supabase
      .channel('traffic-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'traffic_data' }, 
        () => fetchData()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'traffic_incidents' }, 
        () => fetchData()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'traffic_signals' }, 
        () => fetchData()
      )
      .subscribe();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => {
      supabase.removeChannel(trafficChannel);
      clearInterval(intervalId);
    };
  }, []);

  // Group traffic data by location for latest reading
  const latestTrafficByLocation = trafficData.reduce((acc, data) => {
    const existing = acc[data.location_id];
    if (!existing || new Date(data.timestamp) > new Date(existing.timestamp)) {
      acc[data.location_id] = data;
    }
    return acc;
  }, {} as Record<number, TrafficData>);

  const latestTrafficData = Object.values(latestTrafficByLocation);

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
                Incidents ({incidents.length})
              </TabsTrigger>
              <TabsTrigger value="signals">
                <Signal className="h-4 w-4 mr-2" />
                Traffic Signals
              </TabsTrigger>
            </TabsList>
            
            <div className="hidden md:flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSimulationUpdate}
                disabled={isUpdating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                Update Simulation
              </Button>
              <Button variant="outline" size="sm">
                Last updated: {new Date().toLocaleTimeString()}
              </Button>
            </div>
          </div>

          <TabsContent value="traffic" className="mt-4">
            <Card className="relative min-h-[70vh]">
              <CardContent className="p-0">
                <MapContainer
                  center={[8.7642, 78.1348]}
                  zoom={13}
                  style={{ height: '70vh', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Traffic Status Markers */}
                  {latestTrafficData.map((data) => (
                    <Marker
                      key={`traffic-${data.location_id}`}
                      position={[data.latitude, data.longitude]}
                      icon={createTrafficIcon(data.traffic_status)}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{data.location_name}</h3>
                          <p>Status: <span className="capitalize">{data.traffic_status}</span></p>
                          <p>Congestion: {data.congestion_level}%</p>
                          <p>Avg Speed: {data.average_speed?.toFixed(1)} km/h</p>
                          <p>Vehicles: {data.vehicle_count}</p>
                          <p className="text-xs text-gray-500">
                            Updated: {new Date(data.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Incident Markers */}
                  {selectedTab === "traffic" && incidents.map((incident) => (
                    <Marker
                      key={`incident-${incident.id}`}
                      position={[incident.latitude, incident.longitude]}
                      icon={incidentIcon}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-red-600">
                            {incident.incident_type.replace('_', ' ').toUpperCase()}
                          </h3>
                          <p className="capitalize">Severity: {incident.severity}</p>
                          <p>{incident.description}</p>
                          <p className="text-xs text-gray-500">
                            Started: {new Date(incident.start_time).toLocaleString()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="incidents" className="mt-4">
            <Card className="relative min-h-[70vh]">
              <CardContent className="p-0">
                <MapContainer
                  center={[8.7642, 78.1348]}
                  zoom={13}
                  style={{ height: '70vh', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Only Incident Markers */}
                  {incidents.map((incident) => (
                    <Marker
                      key={`incident-${incident.id}`}
                      position={[incident.latitude, incident.longitude]}
                      icon={incidentIcon}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-red-600">
                            {incident.incident_type.replace('_', ' ').toUpperCase()}
                          </h3>
                          <p className="capitalize">Severity: {incident.severity}</p>
                          <p>{incident.description}</p>
                          <p className="text-xs text-gray-500">
                            Started: {new Date(incident.start_time).toLocaleString()}
                          </p>
                          {incident.estimated_end_time && (
                            <p className="text-xs text-gray-500">
                              Est. End: {new Date(incident.estimated_end_time).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signals" className="mt-4">
            <Card className="relative min-h-[70vh]">
              <CardContent className="p-0">
                <MapContainer
                  center={[8.7642, 78.1348]}
                  zoom={13}
                  style={{ height: '70vh', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Traffic Signal Markers */}
                  {signals.map((signal) => (
                    <Marker
                      key={`signal-${signal.location_id}`}
                      position={[signal.latitude, signal.longitude]}
                      icon={signalIcon}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{signal.location_name}</h3>
                          <p>Current Phase: 
                            <span className={`ml-1 capitalize font-semibold ${
                              signal.current_phase === 'green' ? 'text-green-600' :
                              signal.current_phase === 'yellow' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {signal.current_phase}
                            </span>
                          </p>
                          <p>Next Phase In: {signal.next_phase_in}s</p>
                          <p>Cycle Time: {signal.cycle_time}s</p>
                          <p>Optimized: {signal.is_optimized ? 'Yes' : 'No'}</p>
                          <p className="text-xs text-gray-500">
                            Updated: {new Date(signal.updated_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default LiveMap;
