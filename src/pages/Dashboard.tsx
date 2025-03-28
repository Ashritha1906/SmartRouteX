
import { useEffect, useState } from "react";
import { 
  BarChart3, 
  AlertTriangle, 
  TrafficCone, 
  Clock, 
  Activity, 
  Map
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import StatCard from "@/components/dashboard/StatCard";
import TrafficStatusPieChart from "@/components/dashboard/TrafficStatusPieChart";
import RecentIncidents from "@/components/dashboard/RecentIncidents";
import TrafficSignalStatus from "@/components/dashboard/TrafficSignalStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrafficSummary } from "@/lib/traffic-service";

interface TrafficSummary {
  trafficByStatus: {
    smooth: number;
    moderate: number;
    heavy: number;
  };
  avgCongestion: number;
  activeIncidents: number;
  mostCongestedLocation: string;
  mostCongestedLevel: number;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTrafficSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch traffic summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every minute
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <PageLayout title="Dashboard" isAdmin={true}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Congestion"
          value={loading ? "Loading..." : `${Math.round(summary?.avgCongestion || 0)}%`}
          icon={<Activity className="h-4 w-4" />}
          description="City-wide traffic congestion level"
          isLoading={loading}
        />
        <StatCard
          title="Active Incidents"
          value={loading ? "Loading..." : summary?.activeIncidents || 0}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Unresolved traffic incidents"
          isLoading={loading}
        />
        <StatCard
          title="Most Congested Area"
          value={loading ? "Loading..." : summary?.mostCongestedLocation || "Unknown"}
          icon={<Map className="h-4 w-4" />}
          description={loading ? "" : `Congestion level: ${summary?.mostCongestedLevel}%`}
          isLoading={loading}
        />
        <StatCard
          title="Traffic Flow Status"
          value={loading ? "Loading..." : (
            (summary?.trafficByStatus.heavy || 0) > (summary?.trafficByStatus.smooth || 0) 
              ? "Heavy Congestion" 
              : "Normal Flow"
          )}
          icon={<TrafficCone className="h-4 w-4" />}
          description="Overall city traffic status"
          isLoading={loading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Traffic Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficStatusPieChart 
              data={summary?.trafficByStatus || { smooth: 0, moderate: 0, heavy: 0 }}
              isLoading={loading}
            />
          </CardContent>
        </Card>

        <RecentIncidents />
      </div>

      <div className="mt-4">
        <TrafficSignalStatus />
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="mr-3 mt-1 text-blue-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-blue-700">Next Steps for SmartRouteX</h3>
            <p className="text-sm text-blue-600 mt-1">
              Coming soon: Live map integration with Google Maps API, real-time traffic prediction,
              and mobile app notifications for citizens.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
