import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;
  if (!configuredSecret) return true;
  const bearer = request.headers.get('authorization')?.replace('Bearer ', '');
  const querySecret = request.nextUrl.searchParams.get('secret');
  return bearer === configuredSecret || querySecret === configuredSecret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('articles')
    .update({
      status: 'published',
      editorial_status: 'published',
      published_at: now,
      updated_at: now
    })
    .eq('status', 'review')
    .lte('scheduled_at', now)
    .select('id,title,slug');

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, published: data ?? [] });
}
