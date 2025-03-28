
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap";
import TrafficSignals from "./pages/TrafficSignals";
import Incidents from "./pages/Incidents";
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
          {/* Placeholder routes that will redirect to NotFound for now */}
          <Route path="/analytics" element={<NotFound />} />
          <Route path="/historical-data" element={<NotFound />} />
          <Route path="/data-sources" element={<NotFound />} />
          <Route path="/user-management" element={<NotFound />} />
          <Route path="/settings" element={<NotFound />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
