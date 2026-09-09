import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const allowedTables = new Set([
  'articles',
  'categories',
  'site_settings',
  'media_assets',
  'article_revisions',
  'admin_activity_logs',
  'home_sections',
  'submissions',
  'page_contents'
]);

export async function listTable(table: string, limit = 50) {
  if (!allowedTables.has(table)) return [];

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function listCategories() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getLatestSiteSettings() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}
