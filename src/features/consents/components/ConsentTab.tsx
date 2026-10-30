import { useState } from 'react';
import { Scale, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import { CONSENT_TYPE_LABELS, CONSENT_GIVER_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { createConsent, deleteConsent } from '@/features/consents/api';
import type { Consent, ConsentType, ConsentGiver } from '@/types';

interface ConsentTabProps {
  childId: string;
  consents: Consent[];
  onRefresh: () => Promise<void>;
}

export function ConsentTab({ childId, consents, onRefresh }: ConsentTabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleDelete(id: string) {
    await deleteConsent(id);
    await onRefresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Consent Records</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Consent
        </Button>
      </div>

      {consents.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Scale size={28} />}
            title="No consent records"
            description="Document consent for medical care, data sharing, photography, and more"
            action={
              <Button size="sm" onClick={() => setShowAdd(true)}>
                <Plus size={16} /> Add Consent
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {consents.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-teal-100 text-teal-700 border-teal-200">
                      {CONSENT_TYPE_LABELS[c.consent_type]}
                    </Badge>
                    <Badge
                      className={
                        c.is_granted
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }
                    >
                      {c.is_granted ? 'Granted' : 'Declined'}
                    </Badge>
                    <span className="text-xs text-slate-400">{formatDate(c.consent_date)}</span>
                  </div>
                  <dl className="mt-3 space-y-1.5">
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-500">Given by</dt>
                      <dd className="text-sm font-medium text-slate-900">
                        {CONSENT_GIVER_LABELS[c.given_by]} — {c.giver_name}
                      </dd>
                    </div>
                    {c.giver_relationship && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">Relationship</dt>
                        <dd className="text-sm text-slate-700">{c.giver_relationship}</dd>
                      </div>
                    )}
                    {c.expiry_date && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">Expires</dt>
                        <dd className="text-sm text-slate-700">{formatDate(c.expiry_date)}</dd>
                      </div>
                    )}
                    {c.witness_name && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">Witness</dt>
                        <dd className="text-sm text-slate-700">{c.witness_name}</dd>
                      </div>
                    )}
                  </dl>
                  {c.notes && <p className="mt-2 text-sm text-slate-600">{c.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Consent Record" size="lg">
        <ConsentForm
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

function ConsentForm({
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
    const consent = {
      child_id: childId,
      consent_type: form.get('consent_type') as ConsentType,
      given_by: form.get('given_by') as ConsentGiver,
      giver_name: form.get('giver_name') as string,
      giver_relationship: (form.get('giver_relationship') as string) || null,
      is_granted: form.get('is_granted') === 'true',
      consent_date: form.get('consent_date') as string,
      expiry_date: (form.get('expiry_date') as string) || null,
      witness_name: (form.get('witness_name') as string) || null,
      notes: (form.get('notes') as string) || null,
    };
    try {
      await createConsent(consent);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select label="Consent Type" name="consent_type" defaultValue="medical">
          <option value="medical">Medical</option>
          <option value="data_sharing">Data Sharing</option>
          <option value="photography">Photography</option>
          <option value="admission">Admission</option>
          <option value="transfer">Transfer</option>
          <option value="education">Education</option>
        </Select>
        <Select label="Given By" name="given_by" defaultValue="guardian">
          <option value="guardian">Guardian</option>
          <option value="child">Child</option>
          <option value="self">Self</option>
          <option value="court">Court / CWC</option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Giver Name" name="giver_name" required placeholder="Full name of person giving consent" />
        <Input label="Relationship" name="giver_relationship" placeholder="e.g. Father, CWC Chairperson" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Select label="Consent Decision" name="is_granted" defaultValue="true">
          <option value="true">Granted</option>
          <option value="false">Declined</option>
        </Select>
        <Input label="Consent Date" name="consent_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
        <Input label="Expiry Date" name="expiry_date" type="date" />
      </div>
      <Input label="Witness Name" name="witness_name" placeholder="Person witnessing the consent" />
      <Textarea label="Notes" name="notes" rows={2} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Consent'}
        </Button>
      </div>
    </form>
  );
}
