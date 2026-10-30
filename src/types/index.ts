export type CenterType = 'cci' | 'aftercare' | 'community' | 'shelter';
export type CenterStatus = 'active' | 'inactive' | 'at_capacity';

export interface Center {
  id: string;
  name: string;
  type: CenterType;
  district: string;
  capacity: number;
  contact_phone: string | null;
  status: CenterStatus;
  created_at: string;
}

export type ChildStatus = 'active' | 'in_care' | 'reunified' | 'transferred' | 'closed';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Gender = 'male' | 'female' | 'other';

export interface Child {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  photo_url: string | null;
  district: string;
  status: ChildStatus;
  risk_level: RiskLevel;
  center_id: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  admission_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  center?: Center | null;
}

export interface ChildInput {
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  district: string;
  status: ChildStatus;
  risk_level: RiskLevel;
  center_id: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  admission_date: string | null;
  notes: string | null;
}

export type NutritionalStatus = 'normal' | 'mild_moderate_acute' | 'severe_acute';
export type ImmunizationStatus = 'up_to_date' | 'partial' | 'not_started' | 'unknown';

export interface HealthRecord {
  id: string;
  child_id: string;
  record_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  muac_cm: number | null;
  bmi: number | null;
  nutritional_status: NutritionalStatus | null;
  immunization_status: ImmunizationStatus;
  medical_notes: string | null;
  recorded_by: string | null;
  created_at: string;
}

export interface HealthRecordInput {
  child_id: string;
  record_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  muac_cm: number | null;
  nutritional_status: NutritionalStatus | null;
  immunization_status: ImmunizationStatus;
  medical_notes: string | null;
  recorded_by: string | null;
}

export type CaseNoteCategory = 'protection' | 'education' | 'family' | 'medical' | 'other';
export type CaseNotePriority = 'low' | 'medium' | 'high' | 'urgent';
export type CaseNoteStatus = 'open' | 'in_progress' | 'resolved';

export interface CaseNote {
  id: string;
  child_id: string;
  note_date: string;
  category: CaseNoteCategory;
  priority: CaseNotePriority;
  body: string;
  author: string | null;
  status: CaseNoteStatus;
  created_at: string;
  updated_at: string;
  child?: Child | null;
}

export interface CaseNoteInput {
  child_id: string;
  note_date: string;
  category: CaseNoteCategory;
  priority: CaseNotePriority;
  body: string;
  author: string | null;
  status: CaseNoteStatus;
}

export type HandoffType = 'transfer' | 'reunification' | 'temporary' | 'external_referral';
export type HandoffStatus = 'pending' | 'completed' | 'cancelled';

export interface Handoff {
  id: string;
  child_id: string;
  handoff_date: string;
  from_center_id: string | null;
  to_center_id: string | null;
  handoff_type: HandoffType;
  reason: string | null;
  receiving_person: string | null;
  receiving_contact: string | null;
  status: HandoffStatus;
  initiated_by: string | null;
  completed_by: string | null;
  notes: string | null;
  created_at: string;
  child?: Child | null;
  from_center?: Center | null;
  to_center?: Center | null;
}

export interface HandoffInput {
  child_id: string;
  handoff_date: string;
  from_center_id: string | null;
  to_center_id: string | null;
  handoff_type: HandoffType;
  reason: string | null;
  receiving_person: string | null;
  receiving_contact: string | null;
  status: HandoffStatus;
  initiated_by: string | null;
  notes: string | null;
}

export type ConsentType = 'medical' | 'data_sharing' | 'photography' | 'admission' | 'transfer' | 'education';
export type ConsentGiver = 'guardian' | 'child' | 'self' | 'court';

export interface Consent {
  id: string;
  child_id: string;
  consent_type: ConsentType;
  given_by: ConsentGiver;
  giver_name: string;
  giver_relationship: string | null;
  is_granted: boolean;
  consent_date: string;
  expiry_date: string | null;
  witness_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface ConsentInput {
  child_id: string;
  consent_type: ConsentType;
  given_by: ConsentGiver;
  giver_name: string;
  giver_relationship: string | null;
  is_granted: boolean;
  consent_date: string;
  expiry_date: string | null;
  witness_name: string | null;
  notes: string | null;
}


export interface FamilyLink {
  id: string;
  child_id: string;
  relationship: string;
  full_name: string;
  contact_phone: string | null;
  district: string | null;
  verified: boolean;
  notes: string | null;
  created_at: string;
}

export interface FamilyLinkInput {
  child_id: string;
  relationship: string;
  full_name: string;
  contact_phone?: string | null;
  district?: string | null;
  verified?: boolean;
  notes?: string | null;
}

export interface MigrationEvent {
  id: string;
  child_id: string;
  event_date: string;
  from_district: string | null;
  to_district: string | null;
  from_state: string | null;
  to_state: string | null;
  migration_reason: string | null;
  source_verified: boolean;
  case_transferred: boolean;
  receiving_officer: string | null;
  notes: string | null;
  created_at: string;
}

export interface MigrationEventInput {
  child_id: string;
  event_date: string;
  from_district?: string | null;
  to_district?: string | null;
  from_state?: string | null;
  to_state?: string | null;
  migration_reason?: string | null;
  source_verified?: boolean;
  notes?: string | null;
}

export type EnrollmentStatus = 'enrolled' | 'not_enrolled' | 'discontinued' | 'unknown';

export interface SchoolingRecord {
  id: string;
  child_id: string;
  school_name: string | null;
  grade_level: string | null;
  enrollment_status: EnrollmentStatus;
  attendance_percent: number | null;
  language_of_instruction: string | null;
  last_verified_at: string | null;
  notes: string | null;
  updated_at: string;
  destination_school: string | null;
  destination_district: string | null;
  destination_state: string | null;
  transfer_certificate_issued: boolean;
  transfer_certificate_date: string | null;
  last_known_district: string | null;
  last_known_state: string | null;
}

export interface SchoolingRecordInput {
  child_id: string;
  school_name?: string | null;
  grade_level?: string | null;
  enrollment_status: EnrollmentStatus;
  attendance_percent?: number | null;
  language_of_instruction?: string | null;
  last_verified_at?: string | null;
  notes?: string | null;
  destination_school?: string | null;
  destination_district?: string | null;
  destination_state?: string | null;
  transfer_certificate_issued?: boolean;
  transfer_certificate_date?: string | null;
  last_known_district?: string | null;
  last_known_state?: string | null;
}

export type ChildcareServiceType = 'anganwadi' | 'school' | 'health' | 'shelter' | 'counselling' | 'creche' | 'daycare' | 'other';

export interface ChildcareDirectoryItem {
  id: string;
  name: string;
  service_type: ChildcareServiceType;
  district: string;
  address: string | null;
  contact_phone: string | null;
  languages: string[];
  is_active: boolean;
  created_at: string;
}
