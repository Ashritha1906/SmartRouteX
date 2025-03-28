
import { 
  mockLocations, 
  generateRandomTrafficData, 
  generateRandomIncidents, 
  generateTrafficSignals,
  TrafficData,
  TrafficIncident,
  TrafficSignal
} from "./mock-data";

// Simulate real-time traffic data with a cache
let cachedTrafficData: TrafficData[] | null = null;
let cachedIncidents: TrafficIncident[] | null = null;
let cachedSignals: TrafficSignal[] | null = null;
let lastUpdated = 0;

// Update frequency in milliseconds
const UPDATE_FREQUENCY = 30 * 1000; // 30 seconds

// Get traffic data with simulated delay
export const getTrafficData = async (): Promise<TrafficData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const now = Date.now();
  
  // Update cache if needed
  if (!cachedTrafficData || (now - lastUpdated) > UPDATE_FREQUENCY) {
    cachedTrafficData = generateRandomTrafficData();
    lastUpdated = now;
  }
  
  return cachedTrafficData;
};

// Get traffic incidents
export const getTrafficIncidents = async (): Promise<TrafficIncident[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!cachedIncidents) {
    cachedIncidents = generateRandomIncidents(Math.floor(Math.random() * 5) + 3);
  }
  
  return cachedIncidents;
};

// Get traffic signals data
export const getTrafficSignals = async (): Promise<TrafficSignal[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!cachedSignals) {
    cachedSignals = generateTrafficSignals();
  }
  
  // Update signal phases
  cachedSignals = cachedSignals.map(signal => {
    // Randomly change some signals
    if (Math.random() > 0.7) {
      const phases = ["green", "yellow", "red"] as const;
      const currentIndex = phases.indexOf(signal.currentPhase);
      const nextIndex = (currentIndex + 1) % phases.length;
      return {
        ...signal,
        currentPhase: phases[nextIndex],
        nextPhaseIn: Math.floor(Math.random() * 30) + 10
      };
    }
    
    // Decrease time until next phase
    const nextPhaseIn = Math.max(0, signal.nextPhaseIn - 5);
    if (nextPhaseIn === 0) {
      const phases = ["green", "yellow", "red"] as const;
      const currentIndex = phases.indexOf(signal.currentPhase);
      const nextIndex = (currentIndex + 1) % phases.length;
      return {
        ...signal,
        currentPhase: phases[nextIndex],
        nextPhaseIn: signal.currentPhase === "green" ? 10 : signal.currentPhase === "yellow" ? 5 : 30
      };
    }
    
    return {
      ...signal,
      nextPhaseIn
    };
  });
  
  return cachedSignals;
};

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
  return trafficData.find(data => data.locationId === locationId);
};

// Get incidents for a location
export const getIncidentsForLocation = async (locationId: number): Promise<TrafficIncident[]> => {
  const incidents = await getTrafficIncidents();
  return incidents.filter(incident => incident.locationId === locationId);
};

// Get traffic signal for a location
export const getTrafficSignalForLocation = async (locationId: number): Promise<TrafficSignal | undefined> => {
  const signals = await getTrafficSignals();
  return signals.find(signal => signal.locationId === locationId);
};

// Simulate optimizing a traffic signal
export const optimizeTrafficSignal = async (signalId: number): Promise<TrafficSignal> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!cachedSignals) {
    cachedSignals = generateTrafficSignals();
  }
  
  const signalIndex = cachedSignals.findIndex(s => s.id === signalId);
  
  if (signalIndex !== -1) {
    cachedSignals[signalIndex] = {
      ...cachedSignals[signalIndex],
      isOptimized: true,
      cycleTime: Math.floor(cachedSignals[signalIndex].cycleTime * 0.8), // Improve cycle time
      currentPhase: "green", // Set to green
      nextPhaseIn: 25 // Give a longer green phase
    };
  }
  
  return cachedSignals[signalIndex];
};

// Get traffic summary stats
export const getTrafficSummary = async () => {
  const trafficData = await getTrafficData();
  const incidents = await getTrafficIncidents();
  
  // Count traffic by status
  const trafficByStatus = {
    smooth: trafficData.filter(data => data.status === "smooth").length,
    moderate: trafficData.filter(data => data.status === "moderate").length,
    heavy: trafficData.filter(data => data.status === "heavy").length
  };
  
  // Average congestion
  const avgCongestion = trafficData.reduce((sum, data) => sum + data.congestionLevel, 0) / trafficData.length;
  
  // Count active incidents
  const activeIncidents = incidents.filter(inc => !inc.resolved).length;
  
  // Get the most congested location
  const mostCongested = [...trafficData].sort((a, b) => b.congestionLevel - a.congestionLevel)[0];
  const mostCongestedLocation = getLocationById(mostCongested.locationId);
  
  return {
    trafficByStatus,
    avgCongestion,
    activeIncidents,
    mostCongestedLocation: mostCongestedLocation?.name || "Unknown",
    mostCongestedLevel: mostCongested.congestionLevel
  };
};
