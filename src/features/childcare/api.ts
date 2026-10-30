import { supabase } from '@/lib/supabase';
import type { ChildcareDirectoryItem, ChildcareServiceType } from '@/types';

export async function fetchChildcareDirectory(params?: { district?: string; serviceType?: ChildcareServiceType | '' }) {
  let q = supabase.from('childcare_directory').select('*').eq('is_active', true).order('name');
  if (params?.district && params.district.trim()) {
    q = q.eq('district', params.district.trim());
  }
  if (params?.serviceType) {
    q = q.eq('service_type', params.serviceType);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as ChildcareDirectoryItem[];
}
