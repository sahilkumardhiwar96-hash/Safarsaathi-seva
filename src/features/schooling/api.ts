import { supabase } from '@/lib/supabase';
import type { SchoolingRecord, SchoolingRecordInput } from '@/types';

export async function fetchSchoolingRecord(childId: string) {
  const { data, error } = await supabase
    .from('schooling_records')
    .select('*')
    .eq('child_id', childId)
    .maybeSingle();
  if (error) throw error;
  return (data || null) as SchoolingRecord | null;
}

export async function saveSchoolingRecord(input: SchoolingRecordInput & { id?: string }) {
  const { data, error } = await supabase.from('schooling_records').upsert(input).select().single();
  if (error) throw error;
  return data as SchoolingRecord;
}

export async function issueTransferCertificate(params: {
  childId: string;
  id?: string;
  transferCertificateDate: string;
  destinationSchool?: string | null;
  destinationDistrict?: string | null;
  destinationState?: string | null;
}) {
  const patch = {
    child_id: params.childId,
    id: params.id,
    transfer_certificate_issued: true,
    transfer_certificate_date: params.transferCertificateDate,
    destination_school: params.destinationSchool || null,
    destination_district: params.destinationDistrict || null,
    destination_state: params.destinationState || null,
  };
  const { data, error } = await supabase.from('schooling_records').upsert(patch).select().single();
  if (error) throw error;
  return data as SchoolingRecord;
}
