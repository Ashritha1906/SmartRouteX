
import { 
  getTrafficSummary as getRealTimeTrafficSummary,
  getLatestTrafficData,
  getActiveIncidents,
  getTrafficSignals as getRealTimeTrafficSignals,
  type TrafficData,
  type TrafficIncident,
  type TrafficSignal
} from "@/services/real-time-service";
import { supabase } from "@/integrations/supabase/client";

// Tuticorin locations
const mockLocations = [
  { id: 1, name: "VOC Port Road", lat: 8.7642, lng: 78.1348 },
  { id: 2, name: "Palayamkottai Junction", lat: 8.7820, lng: 78.1430 },
  { id: 3, name: "Tiruchendur Road", lat: 8.7550, lng: 78.1250 },
  { id: 4, name: "Railway Station Road", lat: 8.7680, lng: 78.1400 },
  { id: 5, name: "Beach Road", lat: 8.7600, lng: 78.1300 },
  { id: 6, name: "Sankaran Kovil Road", lat: 8.7700, lng: 78.1500 },
  { id: 7, name: "Spic Nagar", lat: 8.7500, lng: 78.1200 },
  { id: 8, name: "Millerpuram", lat: 8.7750, lng: 78.1450 }
];

// Use real-time Supabase data instead of mock data
export const getTrafficData = getLatestTrafficData;
export const getTrafficIncidents = getActiveIncidents;
export const getTrafficSignals = getRealTimeTrafficSignals;

// Get locations
export const getLocations = () => {
  return mockLocations;
};

// Get location by ID
export const getLocationById = (id: number) => {
  return mockLocations.find(location => location.id === id);
};

// Get traffic status for a location
export const getTrafficStatusForLocation = async (locationId: number): Promise<TrafficData | undefined> => {
  const trafficData = await getTrafficData();
  return trafficData.find(data => data.location_id === locationId);
};

// Get incidents for a location
export const getIncidentsForLocation = async (locationId: number): Promise<TrafficIncident[]> => {
  const incidents = await getTrafficIncidents();
  return incidents.filter(incident => incident.location_id === locationId);
};

// Get traffic signal for a location
export const getTrafficSignalForLocation = async (locationId: number): Promise<TrafficSignal | undefined> => {
  const signals = await getTrafficSignals();
  return signals.find(signal => signal.location_id === locationId);
};

// Simulate optimizing a traffic signal
export const optimizeTrafficSignal = async (signalId: string): Promise<TrafficSignal | null> => {
  const { data, error } = await supabase
    .from('traffic_signals')
    .update({
      is_optimized: true,
      cycle_time: 50, // Optimized cycle time
      current_phase: 'green',
      next_phase_in: 25,
      last_optimized: new Date().toISOString()
    })
    .eq('id', signalId)
    .select()
    .single();

  if (error) {
    console.error('Error optimizing signal:', error);
    return null;
  }

  return data;
};

// Use real-time traffic summary
export const getTrafficSummary = getRealTimeTrafficSummary;
