import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import type { HealthRecord, CaseNote, MigrationEvent, Handoff, SchoolingRecord, Center } from '@/types';

type JourneyEvent = {
  id: string;
  date: string;
  type: 'health' | 'protection' | 'migration' | 'handoff' | 'education';
  title: string;
  detail: string;
  location?: string;
};

const JOURNEY_TYPE_CONFIG = {
  health: { label: 'Health', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  protection: { label: 'Protection', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  migration: { label: 'Migration', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  handoff: { label: 'Handoff', color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  education: { label: 'Education', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

export interface JourneyTabProps {
  healthRecords: HealthRecord[];
  caseNotes: CaseNote[];
  migrationEvents: MigrationEvent[];
  handoffs: Handoff[];
  schooling: SchoolingRecord | null;
}

export function JourneyTab({
  healthRecords,
  caseNotes,
  migrationEvents,
  handoffs,
  schooling,
}: JourneyTabProps) {
  const [filter, setFilter] = useState<JourneyEvent['type'] | 'all'>('all');

  const events: JourneyEvent[] = [
    ...healthRecords.map((r) => ({
      id: r.id,
      date: r.record_date,
      type: 'health' as const,
      title: 'Health Assessment',
      detail: [
        r.nutritional_status ? `Nutrition: ${r.nutritional_status.replace(/_/g, ' ')}` : '',
        r.weight_kg ? `Weight: ${r.weight_kg} kg` : '',
        r.medical_notes || '',
      ]
        .filter(Boolean)
        .join(' · '),
      location: undefined,
    })),
    ...caseNotes.map((n) => ({
      id: n.id,
      date: n.note_date,
      type: 'protection' as const,
      title: `Case Note — ${n.category}`,
      detail: n.body,
      location: undefined,
    })),
    ...migrationEvents.map((m) => ({
      id: m.id,
      date: m.event_date,
      type: 'migration' as const,
      title: `Relocation: ${[m.from_district, m.from_state].filter(Boolean).join(', ') || 'Unknown'} → ${
        [m.to_district, m.to_state].filter(Boolean).join(', ') || 'Unknown'
      }`,
      detail: [
        m.migration_reason || '',
        m.case_transferred ? `✓ Case transferred to ${m.receiving_officer || 'officer'}` : '⚠ Case not yet transferred',
      ]
        .filter(Boolean)
        .join(' · '),
      location: [m.to_district, m.to_state].filter(Boolean).join(', '),
    })),
    ...handoffs.map((h) => ({
      id: h.id,
      date: h.handoff_date,
      type: 'handoff' as const,
      title: `Handoff — ${h.handoff_type.replace(/_/g, ' ')}`,
      detail: [h.reason || '', h.receiving_person ? `Receiver: ${h.receiving_person}` : ''].filter(Boolean).join(' · '),
      location: h.to_center ? (h.to_center as Center).name : undefined,
    })),
    ...(schooling
      ? [
          {
            id: schooling.id,
            date: schooling.last_verified_at || schooling.updated_at,
            type: 'education' as const,
            title: `School Enrollment — ${schooling.school_name || 'Assigned School'}`,
            detail: [
              schooling.grade_level || '',
              schooling.attendance_percent !== null ? `Attendance: ${schooling.attendance_percent}%` : '',
              schooling.transfer_certificate_issued ? '✓ TC Issued' : '',
            ]
              .filter(Boolean)
              .join(' · '),
            location: [schooling.last_known_district, schooling.last_known_state].filter(Boolean).join(', '),
          },
        ]
      : []),
  ];

  const sorted = [...events]
    .filter((e) => filter === 'all' || e.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const filterTypes: Array<{ value: JourneyEvent['type'] | 'all'; label: string }> = [
    { value: 'all', label: 'All Departments' },
    { value: 'migration', label: '🟡 Migration' },
    { value: 'protection', label: '🔴 Protection' },
    { value: 'health', label: '🔵 Health' },
    { value: 'education', label: '🟢 Education' },
    { value: 'handoff', label: '⚪ Handoffs' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Child Journey Timeline</h2>
          <p className="text-xs text-slate-500">
            Unified cross-department chronological trail across health, migration, schooling, and guardianship.
          </p>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/60 w-fit">
        {filterTypes.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filter === f.value
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border border-slate-200 shadow-xs">
          <EmptyState
            icon={<MapPin size={32} />}
            title="No events found for this filter"
            description="Assessments, movements, education transfers, and case notes will appear here chronologically."
          />
        </Card>
      ) : (
        <div className="relative pl-6 sm:pl-8">
          {/* Vertical gradient trail line */}
          <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-teal-500 via-slate-300 to-slate-200" />

          <div className="space-y-4">
            {sorted.map((event) => {
              const config = JOURNEY_TYPE_CONFIG[event.type];
              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Timeline icon node */}
                  <div
                    className={`absolute -left-6 sm:-left-8 mt-4.5 h-3.5 w-3.5 rounded-full border-2 border-white ring-2 ring-slate-100 ${config.dot} shadow-xs`}
                  />

                  <div className="flex-1 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <Badge className={`${config.color} font-semibold text-[11px] px-2.5 py-0.5`}>
                            {config.label}
                          </Badge>
                          {event.location && (
                            <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                              <MapPin size={12} className="text-teal-600" /> {event.location}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-900">{event.title}</p>
                        {event.detail && (
                          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            {event.detail}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
