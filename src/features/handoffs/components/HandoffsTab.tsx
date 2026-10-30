import { useState } from 'react';
import { ArrowLeftRight, Plus, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import { HANDOFF_STATUS_COLORS, HANDOFF_STATUS_LABELS, HANDOFF_TYPE_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { createHandoff, markHandoffCompleted } from '@/features/handoffs/api';
import type { Handoff, Center, HandoffType, HandoffStatus } from '@/types';

interface HandoffsTabProps {
  childId: string;
  currentCenterId: string | null;
  centers: Center[];
  handoffs: Handoff[];
  onRefresh: () => Promise<void>;
}

export function HandoffsTab({ childId, currentCenterId, centers, handoffs, onRefresh }: HandoffsTabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleComplete(h: Handoff) {
    await markHandoffCompleted(h.id);
    await onRefresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Handoff History</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Initiate Handoff
        </Button>
      </div>

      {handoffs.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ArrowLeftRight size={28} />}
            title="No handoffs recorded"
            description="Initiate a transfer, reunification, or referral for this child"
            action={
              <Button size="sm" onClick={() => setShowAdd(true)}>
                <Plus size={16} /> Initiate Handoff
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {handoffs.map((h) => (
            <Card key={h.id} className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    h.status === 'completed' ? 'bg-emerald-50' : h.status === 'pending' ? 'bg-amber-50' : 'bg-gray-100'
                  }`}
                >
                  <ArrowLeftRight
                    size={18}
                    className={
                      h.status === 'completed'
                        ? 'text-emerald-600'
                        : h.status === 'pending'
                        ? 'text-amber-600'
                        : 'text-gray-400'
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                      {HANDOFF_TYPE_LABELS[h.handoff_type]}
                    </Badge>
                    <Badge className={HANDOFF_STATUS_COLORS[h.status]}>{HANDOFF_STATUS_LABELS[h.status]}</Badge>
                    <span className="text-xs text-slate-400">{formatDate(h.handoff_date)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{h.reason || 'No reason provided'}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>From: {h.from_center?.name || '—'}</span>
                    <span>To: {h.to_center?.name || '—'}</span>
                    {h.receiving_person && <span>Receiver: {h.receiving_person}</span>}
                  </div>
                  {h.notes && <p className="mt-2 text-sm text-slate-500 italic">{h.notes}</p>}
                  {h.status === 'pending' && (
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <Button size="sm" variant="secondary" onClick={() => handleComplete(h)}>
                        <CheckCircle2 size={14} /> Mark Completed
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Initiate Handoff" size="lg">
        <HandoffForm
          childId={childId}
          centers={centers}
          currentCenterId={currentCenterId}
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

function HandoffForm({
  childId,
  centers,
  currentCenterId,
  onSaved,
  saving,
  setSaving,
}: {
  childId: string;
  centers: Center[];
  currentCenterId: string | null;
  onSaved: () => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const handoff = {
      child_id: childId,
      handoff_date: form.get('handoff_date') as string,
      from_center_id: (form.get('from_center_id') as string) || currentCenterId || null,
      to_center_id: (form.get('to_center_id') as string) || null,
      handoff_type: form.get('handoff_type') as HandoffType,
      reason: (form.get('reason') as string) || null,
      receiving_person: (form.get('receiving_person') as string) || null,
      receiving_contact: (form.get('receiving_contact') as string) || null,
      status: form.get('status') as HandoffStatus,
      initiated_by: (form.get('initiated_by') as string) || null,
      notes: (form.get('notes') as string) || null,
    };
    try {
      await createHandoff(handoff);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select label="Handoff Type" name="handoff_type" defaultValue="transfer">
          <option value="transfer">Transfer</option>
          <option value="reunification">Reunification</option>
          <option value="temporary">Temporary</option>
          <option value="external_referral">External Referral</option>
        </Select>
        <Input label="Handoff Date" name="handoff_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="From Center" name="from_center_id" defaultValue={currentCenterId || ''}>
          <option value="">—</option>
          {centers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select label="To Center" name="to_center_id">
          <option value="">—</option>
          {centers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Receiving Person" name="receiving_person" placeholder="Who receives the child" />
        <Input label="Receiving Contact" name="receiving_contact" placeholder="Contact number" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Initiated By" name="initiated_by" placeholder="Your name" />
        <Select label="Status" name="status" defaultValue="pending">
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>
      <Textarea label="Reason" name="reason" rows={2} placeholder="Why is this handoff happening?" />
      <Textarea label="Notes" name="notes" rows={2} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Initiate Handoff'}
        </Button>
      </div>
    </form>
  );
}
