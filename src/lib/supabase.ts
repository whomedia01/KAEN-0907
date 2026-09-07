import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  }

  return null;
}
