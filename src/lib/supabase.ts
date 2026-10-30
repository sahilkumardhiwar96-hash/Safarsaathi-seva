import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createMockSupabase } from './mockSupabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation is handled inside createSafeClient() below; missing or
// placeholder values fall back to Demo Mode instead of crashing.

// Browser apps must only use the publishable/anon key, never service_role.

function createSafeClient(): SupabaseClient {
  try {
    if (
      supabaseUrl &&
      typeof supabaseUrl === 'string' &&
      supabaseUrl.startsWith('http') &&
      !supabaseUrl.includes('YOUR_PROJECT') &&
      supabaseUrl.includes('.supabase.co') &&
      supabaseAnonKey &&
      !supabaseAnonKey.startsWith('YOUR_') &&
      supabaseAnonKey.length > 20
    ) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
    }
  } catch (err) {
    console.warn('Supabase initialization failed, falling back to Demo Mode:', err);
  }
  return createMockSupabase() as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = createSafeClient();
