import { supabase } from '@/lib/supabase';
import type { CaseNote, CaseNoteInput, CaseNoteStatus } from '@/types';

export async function fetchCaseNotes(childId?: string) {
  let q = supabase.from('case_notes').select('*, child:children(*)').order('note_date', { ascending: false });
  if (childId) {
    q = q.eq('child_id', childId);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as CaseNote[];
}

export async function createCaseNote(input: CaseNoteInput) {
  const { data, error } = await supabase.from('case_notes').insert(input).select().single();
  if (error) throw error;
  return data as CaseNote;
}

export async function updateCaseNoteStatus(id: string, status: CaseNoteStatus) {
  const { data, error } = await supabase
    .from('case_notes')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as CaseNote;
}
