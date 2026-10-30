import { supabase } from '@/lib/supabase';
export const centersRepository = { list: () => supabase.from('centers').select('*').order('name'), create: (input:Record<string,unknown>) => supabase.from('centers').insert(input).select().single() };
