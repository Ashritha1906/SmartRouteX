-- Create tables for real-time traffic monitoring system

-- Traffic data table for storing real-time traffic information
CREATE TABLE public.traffic_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id INTEGER NOT NULL,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  congestion_level INTEGER NOT NULL CHECK (congestion_level >= 0 AND congestion_level <= 100),
  traffic_status TEXT NOT NULL CHECK (traffic_status IN ('smooth', 'moderate', 'heavy', 'blocked')),
  average_speed DECIMAL(5, 2),
  vehicle_count INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Traffic incidents table
CREATE TABLE public.traffic_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id INTEGER NOT NULL,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('accident', 'construction', 'road_closure', 'weather', 'event', 'breakdown')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estimated_end_time TIMESTAMP WITH TIME ZONE,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Traffic signals table
CREATE TABLE public.traffic_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id INTEGER NOT NULL,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  current_phase TEXT NOT NULL CHECK (current_phase IN ('green', 'yellow', 'red')),
  next_phase_in INTEGER NOT NULL DEFAULT 0,
  cycle_time INTEGER NOT NULL DEFAULT 60,
  is_optimized BOOLEAN DEFAULT false,
  last_optimized TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weather data table
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL DEFAULT 'Tuticorin',
  temperature DECIMAL(4, 1),
  humidity INTEGER,
  visibility DECIMAL(4, 1),
  wind_speed DECIMAL(4, 1),
  weather_condition TEXT,
  weather_description TEXT,
  icon TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_traffic_data_location_timestamp ON public.traffic_data(location_id, timestamp DESC);
CREATE INDEX idx_traffic_incidents_location ON public.traffic_incidents(location_id);
CREATE INDEX idx_traffic_incidents_resolved ON public.traffic_incidents(resolved);
CREATE INDEX idx_traffic_signals_location ON public.traffic_signals(location_id);
CREATE INDEX idx_weather_data_timestamp ON public.weather_data(timestamp DESC);

-- Enable Row Level Security (but allow public access since no auth needed)
ALTER TABLE public.traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public read access to traffic_data" ON public.traffic_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert to traffic_data" ON public.traffic_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to traffic_data" ON public.traffic_data FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to traffic_incidents" ON public.traffic_incidents FOR SELECT USING (true);
CREATE POLICY "Allow public insert to traffic_incidents" ON public.traffic_incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to traffic_incidents" ON public.traffic_incidents FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to traffic_signals" ON public.traffic_signals FOR SELECT USING (true);
CREATE POLICY "Allow public insert to traffic_signals" ON public.traffic_signals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to traffic_signals" ON public.traffic_signals FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to weather_data" ON public.weather_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert to weather_data" ON public.weather_data FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_traffic_incidents_updated_at
  BEFORE UPDATE ON public.traffic_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_traffic_signals_updated_at
  BEFORE UPDATE ON public.traffic_signals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.traffic_data REPLICA IDENTITY FULL;
ALTER TABLE public.traffic_incidents REPLICA IDENTITY FULL;
ALTER TABLE public.traffic_signals REPLICA IDENTITY FULL;
ALTER TABLE public.weather_data REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.traffic_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traffic_incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traffic_signals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weather_data;