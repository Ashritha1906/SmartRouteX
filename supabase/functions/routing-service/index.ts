import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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
    const url = new URL(req.url);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');

    if (!start || !end) {
      return new Response(
        JSON.stringify({ error: 'Start and end coordinates are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openrouteApiKey = Deno.env.get('OPENROUTE_API_KEY');
    if (!openrouteApiKey) {
      throw new Error('OPENROUTE_API_KEY not configured');
    }

    // Call OpenRouteService API
    const routeResponse = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${openrouteApiKey}&start=${start}&end=${end}`,
      {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
      }
    );

    if (!routeResponse.ok) {
      throw new Error(`OpenRouteService error: ${routeResponse.status}`);
    }

    const routeData = await routeResponse.json();

    console.log('Route calculated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: routeData 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in routing-service function:', error);
    
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