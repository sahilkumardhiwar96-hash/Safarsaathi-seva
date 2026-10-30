import { supabase } from '@/lib/supabase';
import type { FamilyLink, FamilyLinkInput, MigrationEvent, MigrationEventInput } from '@/types';

export async function fetchFamilyLinks(childId: string) {
  const { data, error } = await supabase
    .from('family_links')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as FamilyLink[];
}

export async function createFamilyLink(input: FamilyLinkInput) {
  const { data, error } = await supabase.from('family_links').insert(input).select().single();
  if (error) throw error;
  return data as FamilyLink;
}

export async function fetchMigrationEvents(childId?: string) {
  let q = supabase.from('migration_events').select('*').order('event_date', { ascending: false });
  if (childId) {
    q = q.eq('child_id', childId);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as MigrationEvent[];
}

export async function createMigrationEvent(input: MigrationEventInput) {
  const { data, error } = await supabase.from('migration_events').insert(input).select().single();
  if (error) throw error;
  return data as MigrationEvent;
}

export async function markCaseTransferred(eventId: string, receivingOfficer: string) {
  const { data, error } = await supabase
    .from('migration_events')
    .update({ case_transferred: true, receiving_officer: receivingOfficer })
    .eq('id', eventId)
    .select()
    .single();
  if (error) throw error;
  return data as MigrationEvent;
}
