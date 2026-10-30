import { supabase } from '@/lib/supabase';
import type { Consent, ConsentInput } from '@/types';

export async function fetchConsents(childId: string) {
  const { data, error } = await supabase
    .from('consents')
    .select('*')
    .eq('child_id', childId)
    .order('consent_date', { ascending: false });
  if (error) throw error;
  return (data || []) as Consent[];
}

export async function createConsent(input: ConsentInput) {
  const { data, error } = await supabase.from('consents').insert(input).select().single();
  if (error) throw error;
  return data as Consent;
}

export async function deleteConsent(id: string) {
  const { error } = await supabase.from('consents').delete().eq('id', id);
  if (error) throw error;
}
