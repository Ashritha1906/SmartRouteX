
// Mock locations in Tuticorin
export const mockLocations = [
  { id: 1, name: "V.O.C Port Junction", lat: 8.7642, lng: 78.1348 },
  { id: 2, name: "Palayamkottai Road", lat: 8.7547, lng: 78.1243 },
  { id: 3, name: "Bryant Nagar", lat: 8.7701, lng: 78.1382 },
  { id: 4, name: "New Bus Stand", lat: 8.7608, lng: 78.1332 },
  { id: 5, name: "Korampallam Gate", lat: 8.7832, lng: 78.1309 },
  { id: 6, name: "Ettayapuram Road", lat: 8.7539, lng: 78.1435 },
  { id: 7, name: "Third Mile", lat: 8.7463, lng: 78.1378 },
  { id: 8, name: "Sipcot Junction", lat: 8.7776, lng: 78.1121 },
  { id: 9, name: "Pudukottai Road", lat: 8.7492, lng: 78.1258 },
  { id: 10, name: "Deep Sea Harbor Road", lat: 8.7918, lng: 78.1562 }
];

// Traffic status types
export type TrafficStatus = "smooth" | "moderate" | "heavy";

// Traffic incident types
export type IncidentType = 
  | "accident" 
  | "construction" 
  | "roadClosure" 
  | "event" 
  | "weatherImpact" 
  | "emergency";

export interface TrafficData {
  locationId: number;
  status: TrafficStatus;
  vehicleCount: number;
  averageSpeed: number;
  congestionLevel: number; // 0-100
  updatedAt: Date;
}

export interface TrafficIncident {
  id: string;
  locationId: number;
  type: IncidentType;
  description: string;
  severity: 1 | 2 | 3; // 1=low, 2=medium, 3=high
  startTime: Date;
  estimatedEndTime: Date | null;
  resolved: boolean;
}

export interface TrafficSignal {
  id: number;
  locationId: number;
  currentPhase: "green" | "yellow" | "red";
  nextPhaseIn: number; // seconds
  isAdaptive: boolean;
  isOptimized: boolean;
  cycleTime: number; // seconds for a complete cycle
}

// Generate random traffic data
export const generateRandomTrafficData = (): TrafficData[] => {
  return mockLocations.map(location => {
    const congestionLevel = Math.floor(Math.random() * 101);
    
    let status: TrafficStatus;
    if (congestionLevel < 30) {
      status = "smooth";
    } else if (congestionLevel < 70) {
      status = "moderate";
    } else {
      status = "heavy";
    }
    
    const averageSpeed = Math.max(5, 60 - (congestionLevel / 2));
    const vehicleCount = Math.floor(Math.random() * 100) + 20;
    
    return {
      locationId: location.id,
      status,
      vehicleCount,
      averageSpeed,
      congestionLevel,
      updatedAt: new Date()
    };
  });
};

// Generate random incidents
export const generateRandomIncidents = (count: number): TrafficIncident[] => {
  const incidentTypes: IncidentType[] = [
    "accident", "construction", "roadClosure", "event", "weatherImpact", "emergency"
  ];
  
  const incidents: TrafficIncident[] = [];
  
  for (let i = 0; i < count; i++) {
    const locationId = mockLocations[Math.floor(Math.random() * mockLocations.length)].id;
    const type = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    const severity = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
    const resolved = Math.random() > 0.7;
    
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - Math.floor(Math.random() * 24));
    
    let description = "";
    switch (type) {
      case "accident":
        description = "Vehicle collision";
        break;
      case "construction":
        description = "Road maintenance";
        break;
      case "roadClosure":
        description = "Full road closure";
        break;
      case "event":
        description = "Public gathering";
        break;
      case "weatherImpact":
        description = "Flooding due to heavy rain";
        break;
      case "emergency":
        description = "Emergency services activity";
        break;
    }
    
    const estimatedEndTime = resolved ? null : new Date();
    if (estimatedEndTime) {
      estimatedEndTime.setHours(estimatedEndTime.getHours() + Math.floor(Math.random() * 5) + 1);
    }
    
    incidents.push({
      id: `INC-${Date.now()}-${i}`,
      locationId,
      type,
      description,
      severity,
      startTime,
      estimatedEndTime,
      resolved
    });
  }
  
  return incidents;
};

// Generate traffic signals data
export const generateTrafficSignals = (): TrafficSignal[] => {
  return mockLocations.map(location => {
    const phases = ["green", "yellow", "red"] as const;
    const currentPhase = phases[Math.floor(Math.random() * phases.length)];
    const isAdaptive = Math.random() > 0.3; // 70% are adaptive
    const isOptimized = isAdaptive && Math.random() > 0.2; // Most adaptive signals are optimized
    const cycleTime = Math.floor(Math.random() * 60) + 60; // 60-120 seconds
    const nextPhaseIn = Math.floor(Math.random() * 30); // 0-30 seconds
    
    return {
      id: location.id,
      locationId: location.id,
      currentPhase,
      nextPhaseIn,
      isAdaptive,
      isOptimized,
      cycleTime
    };
  });
};
