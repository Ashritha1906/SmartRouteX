
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTrafficIncidents, getLocationById } from "@/lib/traffic-service";
import { TrafficIncident, IncidentType } from "@/lib/mock-data";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";

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

const Incidents = () => {
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await getTrafficIncidents();
      setIncidents(data);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
      toast.error("Failed to load traffic incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleResolve = async (incidentId: string) => {
    try {
      setResolvingId(incidentId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the incidents state
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => 
          incident.id === incidentId ? { ...incident, resolved: true } : incident
        )
      );
      
      toast.success("Incident marked as resolved");
    } catch (error) {
      console.error("Failed to resolve incident:", error);
      toast.error("Failed to resolve incident");
    } finally {
      setResolvingId(null);
    }
  };

  const handleRefresh = () => {
    fetchIncidents();
    toast.success("Incident data refreshed");
  };

  return (
    <PageLayout title="Traffic Incidents">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Incidents</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 animate-pulse rounded w-full"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents
                  .filter(incident => !incident.resolved)
                  .map((incident) => {
                    const location = getLocationById(incident.locationId);
                    return (
                      <TableRow key={incident.id}>
                        <TableCell className="font-medium">{location?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getIncidentTypeLabel(incident.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>{incident.description}</TableCell>
                        <TableCell>
                          <Badge 
                            className={getIncidentSeverityClass(incident.severity)}
                          >
                            {incident.severity === 1 ? "Low" : 
                             incident.severity === 2 ? "Medium" : "High"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {incident.startTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolve(incident.id)}
                            disabled={resolvingId === incident.id}
                          >
                            {resolvingId === incident.id ? (
                              <>
                                <span className="h-3 w-3 mr-2 rounded-full bg-current opacity-75 animate-ping"></span>
                                Resolving...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Resolve
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {incidents.filter(incident => !incident.resolved).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center text-muted-foreground">
                        <AlertTriangle className="h-10 w-10 mb-2 opacity-20" />
                        <p>No active incidents found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Resolved Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents
                  .filter(incident => incident.resolved)
                  .map((incident) => {
                    const location = getLocationById(incident.locationId);
                    return (
                      <TableRow key={incident.id}>
                        <TableCell className="font-medium">{location?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getIncidentTypeLabel(incident.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>{incident.description}</TableCell>
                        <TableCell>
                          <Badge 
                            className={getIncidentSeverityClass(incident.severity)}
                          >
                            {incident.severity === 1 ? "Low" : 
                             incident.severity === 2 ? "Medium" : "High"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {incident.startTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                            Resolved
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {incidents.filter(incident => incident.resolved).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center text-muted-foreground">
                        <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
                        <p>No resolved incidents</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Incidents;
