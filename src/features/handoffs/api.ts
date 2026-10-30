import { supabase } from '@/lib/supabase';
import type { Handoff, HandoffInput } from '@/types';

export async function fetchHandoffs(childId?: string) {
  let q = supabase
    .from('handoffs')
    .select('*, child:children(*), from_center:centers!from_center_id(*), to_center:centers!to_center_id(*)')
    .order('handoff_date', { ascending: false });
  if (childId) {
    q = q.eq('child_id', childId);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as Handoff[];
}

export async function createHandoff(input: HandoffInput) {
  const { data, error } = await supabase.from('handoffs').insert(input).select().single();
  if (error) throw error;
  return data as Handoff;
}

export async function markHandoffCompleted(id: string, completedBy = 'Case Worker') {
  const { data, error } = await supabase
    .from('handoffs')
    .update({ status: 'completed', completed_by: completedBy })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Handoff;
}
