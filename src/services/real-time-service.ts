import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type TrafficData = Tables<'traffic_data'>;
export type TrafficIncident = Tables<'traffic_incidents'>;
export type TrafficSignal = Tables<'traffic_signals'>;
export type WeatherData = Tables<'weather_data'>;

// Fetch latest traffic data
export const getLatestTrafficData = async (): Promise<TrafficData[]> => {
  const { data, error } = await supabase
    .from('traffic_data')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching traffic data:', error);
    throw error;
  }

  return data || [];
};

// Fetch active incidents
export const getActiveIncidents = async (): Promise<TrafficIncident[]> => {
  const { data, error } = await supabase
    .from('traffic_incidents')
    .select('*')
    .eq('resolved', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }

  return data || [];
};

// Fetch traffic signals
export const getTrafficSignals = async (): Promise<TrafficSignal[]> => {
  const { data, error } = await supabase
    .from('traffic_signals')
    .select('*')
    .order('location_name');

  if (error) {
    console.error('Error fetching traffic signals:', error);
    throw error;
  }

  return data || [];
};

// Fetch latest weather data
export const getLatestWeatherData = async (): Promise<WeatherData | null> => {
  const { data, error } = await supabase
    .from('weather_data')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }

  return data;
};

// Trigger weather data update
export const updateWeatherData = async () => {
  const { data, error } = await supabase.functions.invoke('weather-data');
  
  if (error) {
    console.error('Error updating weather data:', error);
    throw error;
  }
  
  return data;
};

// Trigger traffic simulation update
export const updateTrafficSimulation = async () => {
  const { data, error } = await supabase.functions.invoke('traffic-simulation');
  
  if (error) {
    console.error('Error updating traffic simulation:', error);
    throw error;
  }
  
  return data;
};

// Get route between two points
export const getRoute = async (start: string, end: string) => {
  const { data, error } = await supabase.functions.invoke('routing-service', {
    body: { start, end }
  });
  
  if (error) {
    console.error('Error getting route:', error);
    throw error;
  }
  
  return data;
};

// Calculate traffic summary
export const getTrafficSummary = async () => {
  const trafficData = await getLatestTrafficData();
  const incidents = await getActiveIncidents();
  
  // Group by location and get latest data for each location
  const locationMap = new Map();
  trafficData.forEach(data => {
    const existing = locationMap.get(data.location_id);
    if (!existing || new Date(data.timestamp) > new Date(existing.timestamp)) {
      locationMap.set(data.location_id, data);
    }
  });
  
  const latestData = Array.from(locationMap.values());
  
  // Count traffic by status
  const trafficByStatus = {
    smooth: latestData.filter(data => data.traffic_status === "smooth").length,
    moderate: latestData.filter(data => data.traffic_status === "moderate").length,
    heavy: latestData.filter(data => data.traffic_status === "heavy").length
  };
  
  // Average congestion
  const avgCongestion = latestData.length > 0 
    ? latestData.reduce((sum, data) => sum + data.congestion_level, 0) / latestData.length
    : 0;
  
  // Count active incidents
  const activeIncidents = incidents.length;
  
  // Get the most congested location
  const mostCongested = latestData.length > 0 
    ? latestData.reduce((max, data) => 
        data.congestion_level > max.congestion_level ? data : max
      )
    : null;
  
  return {
    trafficByStatus,
    avgCongestion,
    activeIncidents,
    mostCongestedLocation: mostCongested?.location_name || "Unknown",
    mostCongestedLevel: mostCongested?.congestion_level || 0
  };
};