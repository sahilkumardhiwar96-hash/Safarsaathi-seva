import { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import { NUTRITIONAL_COLORS, NUTRITIONAL_LABELS, IMMUNIZATION_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { createHealthRecord } from '@/features/health/api';
import type { HealthRecord, NutritionalStatus, ImmunizationStatus } from '@/types';

interface HealthTabProps {
  childId: string;
  records: HealthRecord[];
  onRefresh: () => Promise<void>;
}

export function HealthTab({ childId, records, onRefresh }: HealthTabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Health Records</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Record
        </Button>
      </div>

      {records.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Heart size={28} />}
            title="No health records"
            description="Add a health record to start tracking growth and nutrition"
            action={
              <Button size="sm" onClick={() => setShowAdd(true)}>
                <Plus size={16} /> Add Record
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <Card key={rec.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-5">
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="text-sm font-medium text-slate-900">{formatDate(rec.record_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Height</p>
                    <p className="text-sm font-medium text-slate-900">{rec.height_cm ? `${rec.height_cm} cm` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Weight</p>
                    <p className="text-sm font-medium text-slate-900">{rec.weight_kg ? `${rec.weight_kg} kg` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">MUAC</p>
                    <p className="text-sm font-medium text-slate-900">{rec.muac_cm ? `${rec.muac_cm} cm` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Nutrition</p>
                    {rec.nutritional_status ? (
                      <Badge className={NUTRITIONAL_COLORS[rec.nutritional_status]}>
                        {NUTRITIONAL_LABELS[rec.nutritional_status]}
                      </Badge>
                    ) : (
                      <p className="text-sm">—</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {IMMUNIZATION_LABELS[rec.immunization_status]}
                </Badge>
                {rec.medical_notes && <p className="text-sm text-slate-600">{rec.medical_notes}</p>}
                {rec.recorded_by && <span className="ml-auto text-xs text-slate-400">By {rec.recorded_by}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Health Record">
        <HealthForm
          childId={childId}
          onSaved={async () => {
            setShowAdd(false);
            await onRefresh();
          }}
          saving={saving}
          setSaving={setSaving}
        />
      </Modal>
    </div>
  );
}

function HealthForm({
  childId,
  onSaved,
  saving,
  setSaving,
}: {
  childId: string;
  onSaved: () => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const height = form.get('height_cm') as string;
    const weight = form.get('weight_kg') as string;
    const muac = form.get('muac_cm') as string;
    const bmi =
      height && weight ? Number((Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1)) : null;

    const record = {
      child_id: childId,
      record_date: form.get('record_date') as string,
      height_cm: height ? Number(height) : null,
      weight_kg: weight ? Number(weight) : null,
      muac_cm: muac ? Number(muac) : null,
      bmi,
      nutritional_status: (form.get('nutritional_status') as string || null) as NutritionalStatus | null,
      immunization_status: form.get('immunization_status') as ImmunizationStatus,
      medical_notes: (form.get('medical_notes') as string) || null,
      recorded_by: (form.get('recorded_by') as string) || null,
    };
    try {
      await createHealthRecord(record);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Record Date" name="record_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      <div className="grid grid-cols-3 gap-4">
        <Input label="Height (cm)" name="height_cm" type="number" step="0.1" />
        <Input label="Weight (kg)" name="weight_kg" type="number" step="0.1" />
        <Input label="MUAC (cm)" name="muac_cm" type="number" step="0.1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Nutritional Status" name="nutritional_status">
          <option value="">Not assessed</option>
          <option value="normal">Normal</option>
          <option value="mild_moderate_acute">MAM (Mild/Moderate Acute)</option>
          <option value="severe_acute">SAM (Severe Acute)</option>
        </Select>
        <Select label="Immunization" name="immunization_status" defaultValue="up_to_date">
          <option value="up_to_date">Up to Date</option>
          <option value="partial">Partial</option>
          <option value="not_started">Not Started</option>
          <option value="unknown">Unknown</option>
        </Select>
      </div>
      <Input label="Recorded By" name="recorded_by" placeholder="Doctor/nurse name" />
      <Textarea label="Medical Notes" name="medical_notes" rows={3} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Record'}
        </Button>
      </div>
    </form>
  );
}
