
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap";
import TrafficSignals from "./pages/TrafficSignals";
import Incidents from "./pages/Incidents";
import Analytics from "./pages/Analytics";
import HistoricalData from "./pages/HistoricalData";
import DataSources from "./pages/DataSources";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/traffic-signals" element={<TrafficSignals />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/historical-data" element={<HistoricalData />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/settings" element={<Settings />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
