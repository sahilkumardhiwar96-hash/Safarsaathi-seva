import type {
  ChildStatus, RiskLevel, CaseNotePriority, CaseNoteStatus,
  HandoffStatus, HandoffType, NutritionalStatus, ImmunizationStatus,
  CenterType, CenterStatus, CaseNoteCategory, ConsentType, ConsentGiver, Gender
} from '@/types';

export const CHILD_STATUS_LABELS: Record<ChildStatus, string> = {
  active: 'Active',
  in_care: 'In Care',
  reunified: 'Reunified',
  transferred: 'Transferred',
  closed: 'Closed',
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

export const STATUS_COLORS: Record<ChildStatus, string> = {
  active: 'bg-blue-100 text-blue-700 border-blue-200',
  in_care: 'bg-teal-100 text-teal-700 border-teal-200',
  reunified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  transferred: 'bg-violet-100 text-violet-700 border-violet-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

export const PRIORITY_LABELS: Record<CaseNotePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PRIORITY_COLORS: Record<CaseNotePriority, string> = {
  low: 'bg-gray-100 text-gray-600 border-gray-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
};

export const NOTE_STATUS_LABELS: Record<CaseNoteStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const NOTE_STATUS_COLORS: Record<CaseNoteStatus, string> = {
  open: 'bg-red-100 text-red-700 border-red-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const NOTE_CATEGORY_LABELS: Record<CaseNoteCategory, string> = {
  protection: 'Protection',
  education: 'Education',
  family: 'Family',
  medical: 'Medical',
  other: 'Other',
};

export const HANDOFF_TYPE_LABELS: Record<HandoffType, string> = {
  transfer: 'Transfer',
  reunification: 'Reunification',
  temporary: 'Temporary',
  external_referral: 'External Referral',
};

export const HANDOFF_STATUS_LABELS: Record<HandoffStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const HANDOFF_STATUS_COLORS: Record<HandoffStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
};

export const NUTRITIONAL_LABELS: Record<NutritionalStatus, string> = {
  normal: 'Normal',
  mild_moderate_acute: 'MAM',
  severe_acute: 'SAM',
};

export const NUTRITIONAL_COLORS: Record<NutritionalStatus, string> = {
  normal: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  mild_moderate_acute: 'bg-amber-100 text-amber-700 border-amber-200',
  severe_acute: 'bg-red-100 text-red-700 border-red-200',
};

export const IMMUNIZATION_LABELS: Record<ImmunizationStatus, string> = {
  up_to_date: 'Up to Date',
  partial: 'Partial',
  not_started: 'Not Started',
  unknown: 'Unknown',
};

export const CENTER_TYPE_LABELS: Record<CenterType, string> = {
  cci: 'Childcare Institution',
  aftercare: 'Aftercare',
  community: 'Community Center',
  shelter: 'Shelter',
};

export const CENTER_STATUS_LABELS: Record<CenterStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  at_capacity: 'At Capacity',
};

export const CENTER_STATUS_COLORS: Record<CenterStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  at_capacity: 'bg-amber-100 text-amber-700 border-amber-200',
};

export const CONSENT_TYPE_LABELS: Record<ConsentType, string> = {
  medical: 'Medical',
  data_sharing: 'Data Sharing',
  photography: 'Photography',
  admission: 'Admission',
  transfer: 'Transfer',
  education: 'Education',
};

export const CONSENT_GIVER_LABELS: Record<ConsentGiver, string> = {
  guardian: 'Guardian',
  child: 'Child',
  self: 'Self',
  court: 'Court / CWC',
};
