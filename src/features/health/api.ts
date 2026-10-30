import { supabase } from '@/lib/supabase';
import type { HealthRecord, HealthRecordInput } from '@/types';

export async function fetchHealthRecords(childId: string) {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('child_id', childId)
    .order('record_date', { ascending: false });
  if (error) throw error;
  return (data || []) as HealthRecord[];
}

export async function createHealthRecord(input: HealthRecordInput) {
  const { data, error } = await supabase.from('health_records').insert(input).select().single();
  if (error) throw error;
  return data as HealthRecord;
}
