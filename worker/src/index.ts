interface Env {
  ALLOWED_ORIGINS: string;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    const corsOrigin = allowed.includes(origin) ? origin : '';

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

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
