
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTrafficIncidents, getLocationById } from "@/lib/traffic-service";
import { TrafficIncident, IncidentType } from "@/lib/mock-data";
import { AlertTriangle, Clock } from "lucide-react";

const getIncidentTypeLabel = (type: IncidentType): string => {
  switch (type) {
    case "accident": return "Accident";
    case "construction": return "Construction";
    case "roadClosure": return "Road Closure";
    case "event": return "Public Event";
    case "weatherImpact": return "Weather Impact";
    case "emergency": return "Emergency";
    default: return type;
  }
};

const getIncidentSeverityClass = (severity: 1 | 2 | 3): string => {
  switch (severity) {
    case 1: return "bg-yellow-100 text-yellow-800";
    case 2: return "bg-orange-100 text-orange-800";
    case 3: return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getIncidentTypeIcon = (type: IncidentType) => {
  return <AlertTriangle className="h-4 w-4 mr-1" />;
};

const formatIncidentTime = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

const RecentIncidents = () => {
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setIsLoading(true);
        const data = await getTrafficIncidents();
        // Sort by time (most recent first) and only show active
        const activeIncidents = data
          .filter(incident => !incident.resolved)
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
          .slice(0, 5);
        setIncidents(activeIncidents);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>No active incidents reported</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => {
              const location = getLocationById(incident.locationId);
              return (
                <div key={incident.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {location?.name || "Unknown Location"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{incident.description}</div>
                      
                      <div className="flex items-center mt-2">
                        <Badge
                          variant="outline"
                          className={getIncidentSeverityClass(incident.severity)}
                        >
                          {getIncidentTypeIcon(incident.type)}
                          {getIncidentTypeLabel(incident.type)}
                        </Badge>
                        <div className="ml-2 text-xs flex items-center text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatIncidentTime(incident.startTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentIncidents;
