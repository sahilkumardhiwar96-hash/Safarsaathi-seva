import { Phone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  GENDER_LABELS, NUTRITIONAL_COLORS, NUTRITIONAL_LABELS, IMMUNIZATION_LABELS,
  PRIORITY_COLORS, PRIORITY_LABELS, NOTE_STATUS_COLORS, NOTE_STATUS_LABELS, NOTE_CATEGORY_LABELS,
} from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import type { Child, HealthRecord, CaseNote } from '@/types';

interface OverviewTabProps {
  child: Child;
  healthRecords: HealthRecord[];
  caseNotes: CaseNote[];
  onSelectTab: (tab: 'health' | 'protection') => void;
}

export function OverviewTab({ child, healthRecords, caseNotes, onSelectTab }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="p-5">
        <h3 className="mb-4 font-semibold text-slate-900">Personal Information</h3>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm text-slate-500">Date of Birth</dt>
            <dd className="text-sm font-medium text-slate-900">{formatDate(child.date_of_birth)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-slate-500">Gender</dt>
            <dd className="text-sm font-medium text-slate-900">{GENDER_LABELS[child.gender]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-slate-500">District</dt>
            <dd className="text-sm font-medium text-slate-900">{child.district}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-slate-500">Admission Date</dt>
            <dd className="text-sm font-medium text-slate-900">{formatDate(child.admission_date)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-slate-500">Center</dt>
            <dd className="text-sm font-medium text-slate-900">{child.center?.name || 'Not assigned'}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-semibold text-slate-900">Guardian Information</h3>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm text-slate-500">Guardian Name</dt>
            <dd className="text-sm font-medium text-slate-900">{child.guardian_name || '—'}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-slate-500">Guardian Phone</dt>
            <dd className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
              {child.guardian_phone ? (
                <>
                  <Phone size={14} className="text-teal-500" /> {child.guardian_phone}
                </>
              ) : (
                '—'
              )}
            </dd>
          </div>
        </dl>
        {child.notes && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-1 text-sm text-slate-500">Notes</p>
            <p className="text-sm text-slate-700">{child.notes}</p>
          </div>
        )}
      </Card>

      {/* Latest health snapshot */}
      {healthRecords.length > 0 && (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Latest Health Record</h3>
            <button onClick={() => onSelectTab('health')} className="text-sm text-teal-600 hover:text-teal-700">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500">Height</p>
              <p className="text-lg font-semibold text-slate-900">
                {healthRecords[0].height_cm ? `${healthRecords[0].height_cm} cm` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Weight</p>
              <p className="text-lg font-semibold text-slate-900">
                {healthRecords[0].weight_kg ? `${healthRecords[0].weight_kg} kg` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">MUAC</p>
              <p className="text-lg font-semibold text-slate-900">
                {healthRecords[0].muac_cm ? `${healthRecords[0].muac_cm} cm` : '—'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {healthRecords[0].nutritional_status && (
              <Badge className={NUTRITIONAL_COLORS[healthRecords[0].nutritional_status]}>
                {NUTRITIONAL_LABELS[healthRecords[0].nutritional_status]}
              </Badge>
            )}
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {IMMUNIZATION_LABELS[healthRecords[0].immunization_status]}
            </Badge>
            <span className="text-xs text-slate-400">{formatDate(healthRecords[0].record_date)}</span>
          </div>
        </Card>
      )}

      {/* Open cases */}
      {caseNotes.filter((n) => n.status !== 'resolved').length > 0 && (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Open Case Notes</h3>
            <button onClick={() => onSelectTab('protection')} className="text-sm text-teal-600 hover:text-teal-700">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {caseNotes
              .filter((n) => n.status !== 'resolved')
              .slice(0, 3)
              .map((n) => (
                <div key={n.id}>
                  <div className="flex items-center gap-2">
                    <Badge className={PRIORITY_COLORS[n.priority]}>{PRIORITY_LABELS[n.priority]}</Badge>
                    <Badge className={NOTE_STATUS_COLORS[n.status]}>{NOTE_STATUS_LABELS[n.status]}</Badge>
                    <span className="text-xs text-slate-400">{NOTE_CATEGORY_LABELS[n.category]}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{n.body}</p>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
