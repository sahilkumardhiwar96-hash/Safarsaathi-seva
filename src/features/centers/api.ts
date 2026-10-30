import { supabase } from '@/lib/supabase';
import type { Center, CenterType, CenterStatus } from '@/types';

export interface CenterInput {
  name: string;
  type: CenterType;
  district: string;
  capacity: number;
  contact_phone: string | null;
  status: CenterStatus;
}

export async function fetchCenters() {
  const { data: centersData, error: centersError } = await supabase.from('centers').select('*').order('name');
  if (centersError) throw centersError;

  const { data: childrenData, error: childrenError } = await supabase.from('children').select('center_id');
  if (childrenError) throw childrenError;

  const counts: Record<string, number> = {};
  (childrenData || []).forEach((c) => {
    if (c.center_id) counts[c.center_id] = (counts[c.center_id] || 0) + 1;
  });

  return (centersData || []).map((c) => ({
    ...(c as Center),
    child_count: counts[c.id] || 0,
  }));
}

export async function createCenter(input: CenterInput) {
  const { data, error } = await supabase.from('centers').insert(input).select().single();
  if (error) throw error;
  return data as Center;
}
