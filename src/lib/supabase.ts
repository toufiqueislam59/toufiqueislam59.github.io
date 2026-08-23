import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://ikjuwmkooeucaaxkexeq.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_fyig6zHzRn8tMrn47GDoiQ_2QHY5FGk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
