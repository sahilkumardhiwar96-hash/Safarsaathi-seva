import { supabase } from '@/lib/supabase';

export const familyRepository = {
  list: (childId?: string) => {
    let q = supabase.from('family_links').select('*').order('created_at', { ascending: false });
    if (childId) q = q.eq('child_id', childId);
    return q;
  },
  add: (input: Record<string, unknown>) =>
    supabase.from('family_links').insert(input).select().single(),
  migrationHistory: (childId?: string) => {
    let q = supabase.from('migration_events').select('*').order('event_date', { ascending: false });
    if (childId) q = q.eq('child_id', childId);
    return q;
  },
  markCaseTransferred: (eventId: string, receivingOfficer: string) =>
    supabase
      .from('migration_events')
      .update({ case_transferred: true, receiving_officer: receivingOfficer })
      .eq('id', eventId),
};
