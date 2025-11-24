import type { APIRoute } from 'astro';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { contentType, contentId, contentSlug, contentName, field, value } = body;

    if (!contentType || !contentId || !field) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/content_visibility`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        content_type: contentType,
        content_id: contentId,
        content_slug: contentSlug,
        content_name: contentName,
        [field]: value,
        updated_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update visibility' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const contentType = url.searchParams.get('type');
    const contentId = url.searchParams.get('id');

    let queryUrl = `${SUPABASE_URL}/rest/v1/content_visibility?select=*`;

    if (contentType) {
      queryUrl += `&content_type=eq.${contentType}`;
    }
    if (contentId) {
      queryUrl += `&content_id=eq.${contentId}`;
    }

    const response = await fetch(queryUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch visibility data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
