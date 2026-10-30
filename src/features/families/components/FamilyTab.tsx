import { useState } from 'react';
import { Users, Plus, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { createFamilyLink, createMigrationEvent, markCaseTransferred } from '@/features/families/api';
import type { FamilyLink, MigrationEvent } from '@/types';

interface FamilyTabProps {
  childId: string;
  currentDistrict: string;
  familyLinks: FamilyLink[];
  migrationEvents: MigrationEvent[];
  onRefresh: () => Promise<void>;
}

export function FamilyTab({
  childId,
  currentDistrict,
  familyLinks,
  migrationEvents,
  onRefresh,
}: FamilyTabProps) {
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showAddMigration, setShowAddMigration] = useState(false);
  const [showMarkTransfer, setShowMarkTransfer] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Family Links</h2>
            <p className="text-xs text-slate-500">Document family contacts, relatives, and guardianship verification</p>
          </div>
          <Button size="sm" onClick={() => setShowAddFamily(true)}>
            <Plus size={16} /> Add Family Link
          </Button>
        </div>
        {familyLinks.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Users size={28} />}
              title="No family links documented"
              description="Record verified relatives or parents to assist with visitation and reunification"
              action={
                <Button size="sm" onClick={() => setShowAddFamily(true)}>
                  <Plus size={16} /> Add Family Link
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {familyLinks.map((fl) => (
              <Card key={fl.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{fl.full_name}</h4>
                    <p className="text-xs font-medium text-teal-700">{fl.relationship}</p>
                  </div>
                  <Badge
                    className={
                      fl.verified
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }
                  >
                    {fl.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  {fl.contact_phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" /> {fl.contact_phone}
                    </div>
                  )}
                  {fl.district && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" /> District: {fl.district}
                    </div>
                  )}
                  {fl.notes && <p className="mt-2 text-slate-500 italic">{fl.notes}</p>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Inter-District Migration History</h2>
            <p className="text-xs text-slate-500">Track movement between districts for vulnerable or migrant child monitoring</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setShowAddMigration(true)}>
            <Plus size={16} /> Record Movement
          </Button>
        </div>
        {migrationEvents.length === 0 ? (
          <Card>
            <EmptyState
              icon={<MapPin size={28} />}
              title="No migration events recorded"
              description="Record district movements or relocations"
              action={
                <Button size="sm" variant="secondary" onClick={() => setShowAddMigration(true)}>
                  <Plus size={16} /> Record Movement
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {migrationEvents.map((me) => (
              <Card key={me.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span>{[me.from_district, me.from_state].filter(Boolean).join(', ') || 'Origin'}</span>
                    <ArrowRight size={14} className="text-teal-600" />
                    <span>{[me.to_district, me.to_state].filter(Boolean).join(', ') || 'Destination'}</span>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(me.event_date)}</span>
                </div>
                {me.migration_reason && <p className="mt-2 text-xs text-slate-600">Reason: {me.migration_reason}</p>}
                {me.notes && <p className="mt-1 text-xs text-slate-500 italic">{me.notes}</p>}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  {me.case_transferred ? (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">
                        Case transferred to: {me.receiving_officer || 'Officer'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-amber-700 font-medium">⚠ Case not yet transferred</span>
                    </div>
                  )}
                  {!me.case_transferred && (
                    <Button size="sm" variant="secondary" onClick={() => setShowMarkTransfer(me.id)}>
                      Mark Case Transferred
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={showAddFamily} onClose={() => setShowAddFamily(false)} title="Add Family Link">
        <FamilyLinkForm
          childId={childId}
          onSaved={async () => {
            setShowAddFamily(false);
            await onRefresh();
          }}
          saving={saving}
          setSaving={setSaving}
        />
      </Modal>

      <Modal open={showAddMigration} onClose={() => setShowAddMigration(false)} title="Record Migration Event">
        <MigrationForm
          childId={childId}
          currentDistrict={currentDistrict}
          onSaved={async () => {
            setShowAddMigration(false);
            await onRefresh();
          }}
          saving={saving}
          setSaving={setSaving}
        />
      </Modal>

      <Modal open={!!showMarkTransfer} onClose={() => setShowMarkTransfer(null)} title="Mark Case Transferred">
        <MarkTransferForm
          eventId={showMarkTransfer!}
          onSaved={async () => {
            setShowMarkTransfer(null);
            await onRefresh();
          }}
          saving={saving}
          setSaving={setSaving}
        />
      </Modal>
    </div>
  );
}

function FamilyLinkForm({
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
    const link = {
      child_id: childId,
      full_name: form.get('full_name') as string,
      relationship: form.get('relationship') as string,
      contact_phone: (form.get('contact_phone') as string) || null,
      district: (form.get('district') as string) || null,
      verified: form.get('verified') === 'true',
      notes: (form.get('notes') as string) || null,
    };
    try {
      await createFamilyLink(link);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" name="full_name" required placeholder="Parent or relative full name" />
        <Input label="Relationship" name="relationship" required placeholder="e.g. Mother, Uncle, Grandfather" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Contact Phone" name="contact_phone" placeholder="+91-9876543210" />
        <Input label="District" name="district" placeholder="District name" />
      </div>
      <Select label="Verification Status" name="verified" defaultValue="true">
        <option value="true">Verified (Identification checked)</option>
        <option value="false">Unverified</option>
      </Select>
      <Textarea label="Notes" name="notes" rows={2} placeholder="Visitation rights, CWC order reference, etc." />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Family Link'}
        </Button>
      </div>
    </form>
  );
}

function MigrationForm({
  childId,
  currentDistrict,
  onSaved,
  saving,
  setSaving,
}: {
  childId: string;
  currentDistrict: string;
  onSaved: () => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const event = {
      child_id: childId,
      event_date: form.get('event_date') as string,
      from_district: (form.get('from_district') as string) || null,
      from_state: (form.get('from_state') as string) || null,
      to_district: (form.get('to_district') as string) || null,
      to_state: (form.get('to_state') as string) || null,
      migration_reason: (form.get('migration_reason') as string) || null,
      source_verified: form.get('source_verified') === 'true',
      notes: (form.get('notes') as string) || null,
    };
    try {
      await createMigrationEvent(event);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Event Date" name="event_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="From District" name="from_district" defaultValue={currentDistrict} />
        <Input label="From State" name="from_state" defaultValue="Odisha" placeholder="Origin state" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="To District" name="to_district" required placeholder="Destination district" />
        <Input label="To State" name="to_state" defaultValue="Odisha" placeholder="Destination state" />
      </div>
      <Input label="Migration Reason" name="migration_reason" placeholder="e.g. Brick kiln seasonal work, construction, CWC transfer" />
      <Select label="Verification Status" name="source_verified" defaultValue="true">
        <option value="true">Verified by Field Worker / CWC</option>
        <option value="false">Unverified self-report</option>
      </Select>
      <Textarea label="Notes" name="notes" rows={2} placeholder="Transit details, accompanying guardians, etc." />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Record Movement'}
        </Button>
      </div>
    </form>
  );
}

function MarkTransferForm({
  eventId,
  onSaved,
  saving,
  setSaving,
}: {
  eventId: string;
  onSaved: () => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const officer = form.get('receiving_officer') as string;
    try {
      await markCaseTransferred(eventId, officer);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
        <p className="text-sm text-blue-800 font-medium">Confirm Case Transfer</p>
        <p className="text-xs text-blue-700 mt-1">
          Record that the case has been handed over to a receiving officer or department at the destination district. This resolves the lost case alert.
        </p>
      </div>
      <Input
        label="Receiving Officer / Department"
        name="receiving_officer"
        required
        placeholder="e.g. Raipur DCPO – Suresh Kumar"
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Mark Case Transferred ✓'}
        </Button>
      </div>
    </form>
  );
}
