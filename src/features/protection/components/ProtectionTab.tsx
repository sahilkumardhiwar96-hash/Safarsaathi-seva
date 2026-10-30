import { useState } from 'react';
import { ClipboardList, Plus, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  PRIORITY_COLORS, PRIORITY_LABELS, NOTE_STATUS_COLORS, NOTE_STATUS_LABELS, NOTE_CATEGORY_LABELS,
} from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { createCaseNote, updateCaseNoteStatus } from '@/features/protection/api';
import type { CaseNote, CaseNoteCategory, CaseNotePriority, CaseNoteStatus } from '@/types';

interface ProtectionTabProps {
  childId: string;
  notes: CaseNote[];
  onRefresh: () => Promise<void>;
}

export function ProtectionTab({ childId, notes, onRefresh }: ProtectionTabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(note: CaseNote, status: CaseNoteStatus) {
    await updateCaseNoteStatus(note.id, status);
    await onRefresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Case Notes</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No case notes"
            description="Add a case note to document protection, education, or family matters"
            action={
              <Button size="sm" onClick={() => setShowAdd(true)}>
                <Plus size={16} /> Add Note
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} className="p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className={PRIORITY_COLORS[note.priority]}>{PRIORITY_LABELS[note.priority]}</Badge>
                <Badge className={NOTE_STATUS_COLORS[note.status]}>{NOTE_STATUS_LABELS[note.status]}</Badge>
                <span className="text-xs font-medium text-slate-500">{NOTE_CATEGORY_LABELS[note.category]}</span>
                <span className="ml-auto text-xs text-slate-400">
                  {formatDate(note.note_date)} · {note.author || 'Unknown'}
                </span>
              </div>
              <p className="text-sm text-slate-700">{note.body}</p>
              {note.status !== 'resolved' && (
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                  {note.status === 'open' && (
                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(note, 'in_progress')}>
                      Mark In Progress
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => handleStatusChange(note, 'resolved')}>
                    <CheckCircle2 size={14} /> Mark Resolved
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Case Note" size="lg">
        <CaseNoteForm
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

function CaseNoteForm({
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
    const note = {
      child_id: childId,
      note_date: form.get('note_date') as string,
      category: form.get('category') as CaseNoteCategory,
      priority: form.get('priority') as CaseNotePriority,
      body: form.get('body') as string,
      author: (form.get('author') as string) || null,
      status: form.get('status') as CaseNoteStatus,
    };
    try {
      await createCaseNote(note);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Date" name="note_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
        <Input label="Author" name="author" placeholder="Your name" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Select label="Category" name="category" defaultValue="protection">
          <option value="protection">Protection</option>
          <option value="education">Education</option>
          <option value="family">Family</option>
          <option value="medical">Medical</option>
          <option value="other">Other</option>
        </Select>
        <Select label="Priority" name="priority" defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
        <Select label="Status" name="status" defaultValue="open">
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </Select>
      </div>
      <Textarea label="Note" name="body" rows={5} required placeholder="Describe the case note details..." />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Note'}
        </Button>
      </div>
    </form>
  );
}
