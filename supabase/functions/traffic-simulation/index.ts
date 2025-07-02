import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tuticorin traffic monitoring locations
const locations = [
  { id: 1, name: "VOC Port Road", lat: 8.7642, lng: 78.1348 },
  { id: 2, name: "Palayamkottai Junction", lat: 8.7820, lng: 78.1430 },
  { id: 3, name: "Tiruchendur Road", lat: 8.7550, lng: 78.1250 },
  { id: 4, name: "Railway Station Road", lat: 8.7680, lng: 78.1400 },
  { id: 5, name: "Beach Road", lat: 8.7600, lng: 78.1300 },
  { id: 6, name: "Sankaran Kovil Road", lat: 8.7700, lng: 78.1500 },
  { id: 7, name: "Spic Nagar", lat: 8.7500, lng: 78.1200 },
  { id: 8, name: "Millerpuram", lat: 8.7750, lng: 78.1450 }
];

const trafficStatuses = ['smooth', 'moderate', 'heavy', 'blocked'];
const incidentTypes = ['accident', 'construction', 'road_closure', 'weather', 'event', 'breakdown'];
const severityLevels = ['low', 'medium', 'high', 'critical'];
const signalPhases = ['green', 'yellow', 'red'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateTrafficData() {
  return locations.map(location => {
    const congestionLevel = Math.floor(Math.random() * 100);
    const status = congestionLevel < 30 ? 'smooth' : 
                  congestionLevel < 60 ? 'moderate' : 
                  congestionLevel < 85 ? 'heavy' : 'blocked';
    
    return {
      location_id: location.id,
      location_name: location.name,
      latitude: location.lat,
      longitude: location.lng,
      congestion_level: congestionLevel,
      traffic_status: status,
      average_speed: Math.max(10, 60 - (congestionLevel * 0.5)),
      vehicle_count: Math.floor(Math.random() * 200) + 50
    };
  });
}

function generateIncidents() {
  const incidents = [];
  const numIncidents = Math.floor(Math.random() * 3) + 1; // 1-3 incidents
  
  for (let i = 0; i < numIncidents; i++) {
    const location = getRandomElement(locations);
    incidents.push({
      location_id: location.id,
      incident_type: getRandomElement(incidentTypes),
      severity: getRandomElement(severityLevels),
      description: `Traffic incident reported at ${location.name}`,
      latitude: location.lat,
      longitude: location.lng,
      resolved: Math.random() > 0.7, // 30% chance of being resolved
      estimated_end_time: new Date(Date.now() + Math.random() * 3600000).toISOString() // Random end time within 1 hour
    });
  }
  
  return incidents;
}

function generateSignals() {
  return locations.map(location => ({
    location_id: location.id,
    location_name: location.name,
    latitude: location.lat,
    longitude: location.lng,
    current_phase: getRandomElement(signalPhases),
    next_phase_in: Math.floor(Math.random() * 60) + 10,
    cycle_time: Math.floor(Math.random() * 30) + 60, // 60-90 seconds
    is_optimized: Math.random() > 0.5
  }));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate and insert traffic data
    const trafficData = generateTrafficData();
    const { error: trafficError } = await supabase
      .from('traffic_data')
      .insert(trafficData);

    if (trafficError) {
      console.error('Traffic data error:', trafficError);
    }

    // Generate and insert incidents
    const incidents = generateIncidents();
    const { error: incidentError } = await supabase
      .from('traffic_incidents')
      .insert(incidents);

    if (incidentError) {
      console.error('Incident data error:', incidentError);
    }

    // Generate and update signals
    const signals = generateSignals();
    for (const signal of signals) {
      await supabase
        .from('traffic_signals')
        .upsert(signal, { onConflict: 'location_id' });
    }

    console.log('Traffic simulation data updated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Traffic simulation data updated successfully',
        counts: {
          traffic: trafficData.length,
          incidents: incidents.length,
          signals: signals.length
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in traffic-simulation function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});