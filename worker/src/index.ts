interface Env {
  ALLOWED_ORIGINS: string;
  GOOGLE_PLACES_API_KEY: string;
  GOOGLE_PLACE_ID: string;
}

interface FormData {
  name: string;
  phone: string;
  email?: string;
  postcode?: string;
  service?: string;
  message?: string;
  webhookUrl: string;
  source?: string;
}

// In-memory cache for reviews (persists across requests within the same worker instance)
let reviewsCache: { data: string; expiry: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    const corsOrigin = allowed.includes(origin) ? origin : '';

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Reviews endpoint
    if (url.pathname === '/reviews' && request.method === 'GET') {
      return handleReviews(env, corsHeaders);
    }

    // Form submission (existing)
    if (request.method !== 'POST') {
      return Response.json(
        { success: false, error: 'Method not allowed' },
        { status: 405, headers: corsHeaders }
      );
    }

    try {
      const data: FormData = await request.json();

      if (!data.name || !data.phone || !data.webhookUrl) {
        return Response.json(
          { success: false, error: 'Name, phone, and webhookUrl are required' },
          { status: 400, headers: corsHeaders }
        );
      }

      const ghlPayload = {
        name: data.name,
        phone: data.phone,
        email: (data as any).email || '',
        postcode: (data as any).postcode || '',
        service: (data as any).service || '',
        property: (data as any).property || '',
        urgency: (data as any).urgency || '',
        message: (data as any).message || '',
        source: data.source || 'Landing Page',
      };

      const ghlResponse = await fetch(data.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ghlPayload),
      });

      if (!ghlResponse.ok) {
        const errorText = await ghlResponse.text();
        console.error('GHL error:', errorText);
        return Response.json(
          { success: false, error: 'Failed to submit enquiry' },
          { status: 502, headers: corsHeaders }
        );
      }

      return Response.json(
        { success: true, message: 'Enquiry submitted' },
        { status: 200, headers: corsHeaders }
      );
    } catch (err) {
      console.error('Worker error:', err);
      return Response.json(
        { success: false, error: 'Invalid request' },
        { status: 400, headers: corsHeaders }
      );
    }
  },
};

async function handleReviews(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  // Return cached data if still fresh
  if (reviewsCache && Date.now() < reviewsCache.expiry) {
    return new Response(reviewsCache.data, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${env.GOOGLE_PLACE_ID}&fields=name,rating,user_ratings_total,reviews&key=${env.GOOGLE_PLACES_API_KEY}`;
    const res = await fetch(apiUrl);
    const json: any = await res.json();

    if (json.status !== 'OK') {
      console.error('Google Places API error:', json.status);
      return Response.json(
        { success: false, error: 'Failed to fetch reviews' },
        { status: 502, headers: corsHeaders }
      );
    }

    const payload = JSON.stringify({
      success: true,
      name: json.result.name,
      rating: json.result.rating,
      totalReviews: json.result.user_ratings_total,
      reviews: (json.result.reviews || []).slice(0, 4).map((r: any) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.time,
        relativeTime: r.relative_time_description,
        photoUrl: r.profile_photo_url,
      })),
    });

    // Cache the response
    reviewsCache = { data: payload, expiry: Date.now() + CACHE_TTL };

    return new Response(payload, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (err) {
    console.error('Reviews fetch error:', err);
    return Response.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500, headers: corsHeaders }
    );
  }
}
