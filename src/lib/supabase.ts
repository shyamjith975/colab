import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase Database & Auth
export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://colab-marketplace-prod.supabase.co';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbGFiLXByb2QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMTUwNDAwMCwiZXhwIjoyMDQ3MDgwMDAwfQ.demo_secure_anon_key_for_colab_marketplace_api_access';

// Initialize the Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Check if the live Supabase credentials point to a connected backend or demo sandbox
 */
export const isLiveSupabaseAvailable = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
};
