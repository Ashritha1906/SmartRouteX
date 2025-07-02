import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const weatherApiKey = Deno.env.get('WEATHER_API_KEY');
    if (!weatherApiKey) {
      throw new Error('WEATHER_API_KEY not configured');
    }

    // Fetch weather data for Tuticorin
    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=Tuticorin&aqi=no`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    // Insert weather data into Supabase
    const { data, error } = await supabase
      .from('weather_data')
      .insert({
        location: 'Tuticorin',
        temperature: current.temp_c,
        humidity: current.humidity,
        visibility: current.vis_km,
        wind_speed: current.wind_kph,
        weather_condition: current.condition.text,
        weather_description: current.condition.text,
        icon: current.condition.icon
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Weather data updated successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: 'Weather data updated successfully' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in weather-data function:', error);
    
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