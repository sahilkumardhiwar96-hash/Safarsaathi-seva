import { supabase } from '@/lib/supabase';

export const educationRepository = {
  list: (childId?: string) => {
    let q = supabase.from('schooling_records').select('*').order('updated_at', { ascending: false });
    if (childId) q = q.eq('child_id', childId);
    return q;
  },
  save: (input: Record<string, unknown>) =>
    supabase.from('schooling_records').upsert(input).select().single(),
  childcareDirectory: (district?: string, serviceType?: string) => {
    let q = supabase
      .from('childcare_directory')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (district) q = q.eq('district', district);
    if (serviceType) q = q.eq('service_type', serviceType);
    return q;
  },
};
