import { supabase } from '@/lib/supabase';
import type { Child, ChildInput } from '@/types';

export async function fetchChildren() {
  const { data, error } = await supabase
    .from('children')
    .select('*, center:centers(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Child[];
}

export async function fetchChildById(id: string) {
  const { data, error } = await supabase
    .from('children')
    .select('*, center:centers(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data || null) as Child | null;
}

export async function createChild(input: ChildInput) {
  const { data, error } = await supabase.from('children').insert(input).select().single();
  if (error) throw error;
  return data as Child;
}

export async function updateChild(id: string, patch: Partial<ChildInput>) {
  const { data, error } = await supabase
    .from('children')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Child;
}
