import { useState } from 'react';
import { BookOpen, Plus, FileCheck, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { saveSchoolingRecord, issueTransferCertificate } from '@/features/schooling/api';
import type { SchoolingRecord, EnrollmentStatus } from '@/types';

interface SchoolingTabProps {
  childId: string;
  schooling: SchoolingRecord | null;
  onRefresh: () => Promise<void>;
}

export function SchoolingTab({ childId, schooling, onRefresh }: SchoolingTabProps) {
  const [showEditSchooling, setShowEditSchooling] = useState(false);
  const [showRequestTC, setShowRequestTC] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Schooling &amp; Education Record</h2>
          <p className="text-xs text-slate-500">Track Right to Education enrollment, school attendance, and learning language</p>
        </div>
        <Button size="sm" onClick={() => setShowEditSchooling(true)}>
          {schooling ? 'Update Education' : 'Add Education Record'}
        </Button>
      </div>

      {schooling ? (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{schooling.school_name || 'School Not Assigned'}</h3>
                <p className="text-sm font-medium text-teal-700">{schooling.grade_level || 'Grade not specified'}</p>
              </div>
              <Badge
                className={
                  schooling.enrollment_status === 'enrolled'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-rose-100 text-rose-700 border-rose-200'
                }
              >
                {schooling.enrollment_status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <span className="text-xs text-slate-500">Attendance</span>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {schooling.attendance_percent !== null ? `${schooling.attendance_percent}%` : 'N/A'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <span className="text-xs text-slate-500">Instruction Medium</span>
                <p className="mt-1 text-xl font-bold text-slate-900">{schooling.language_of_instruction || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <span className="text-xs text-slate-500">Last Verified</span>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {schooling.last_verified_at ? formatDate(schooling.last_verified_at) : 'Not verified'}
                </p>
              </div>
            </div>

            {schooling.notes && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">Educational Assessment Notes</p>
                <p className="mt-1 text-sm text-slate-700">{schooling.notes}</p>
              </div>
            )}
          </Card>

          {/* School Transfer Status Card */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <GraduationCap size={18} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">School Transfer Status</h3>
              </div>
              {!schooling.transfer_certificate_issued && (
                <Button size="sm" variant="secondary" onClick={() => setShowRequestTC(true)}>
                  <FileCheck size={14} /> Request Transfer Certificate
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500 mb-1">Transfer Certificate</p>
                {schooling.transfer_certificate_issued ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">✓ ISSUED</Badge>
                    {schooling.transfer_certificate_date && (
                      <span className="text-xs text-slate-500">on {formatDate(schooling.transfer_certificate_date)}</span>
                    )}
                  </div>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">NOT ISSUED</Badge>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Origin Location</p>
                <p className="text-sm font-medium text-slate-700">
                  {[schooling.last_known_district, schooling.last_known_state].filter(Boolean).join(', ') || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Destination School</p>
                <p className="text-sm font-medium text-slate-700">{schooling.destination_school || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Destination Location</p>
                <p className="text-sm font-medium text-slate-700">
                  {[schooling.destination_district, schooling.destination_state].filter(Boolean).join(', ') || '—'}
                </p>
              </div>
            </div>

            {!schooling.transfer_certificate_issued &&
              (schooling.destination_school || schooling.destination_district) && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-medium text-amber-800">
                    ⚠ Transfer certificate not yet issued. The destination school may not accept the child without it.
                    Click "Request Transfer Certificate" to mark it as issued once obtained from the current school.
                  </p>
                </div>
              )}
          </Card>
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<BookOpen size={28} />}
            title="No schooling record found"
            description="Record the child's school enrollment, grade, and attendance details."
            action={
              <Button size="sm" onClick={() => setShowEditSchooling(true)}>
                <Plus size={16} /> Add Schooling Info
              </Button>
            }
          />
        </Card>
      )}

      <Modal open={showEditSchooling} onClose={() => setShowEditSchooling(false)} title="Update Schooling Record" size="lg">
        <SchoolingForm
          childId={childId}
          initialData={schooling}
          onSaved={async () => {
            setShowEditSchooling(false);
            await onRefresh();
          }}
          saving={saving}
          setSaving={setSaving}
        />
      </Modal>

      <Modal open={showRequestTC} onClose={() => setShowRequestTC(false)} title="Issue Transfer Certificate">
        <TransferCertificateForm
          childId={childId}
          schooling={schooling}
          onSaved={async () => {
            setShowRequestTC(false);
            await onRefresh();
          }}
          saving={saving}
          setSaving={setSaving}
        />
      </Modal>
    </div>
  );
}

function SchoolingForm({
  childId,
  initialData,
  onSaved,
  saving,
  setSaving,
}: {
  childId: string;
  initialData: SchoolingRecord | null;
  onSaved: () => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const attendance = form.get('attendance_percent') as string;
    const record = {
      id: initialData?.id,
      child_id: childId,
      school_name: (form.get('school_name') as string) || null,
      grade_level: (form.get('grade_level') as string) || null,
      enrollment_status: (form.get('enrollment_status') as EnrollmentStatus) || 'unknown',
      attendance_percent: attendance ? Number(attendance) : null,
      language_of_instruction: (form.get('language_of_instruction') as string) || null,
      last_verified_at: (form.get('last_verified_at') as string) || null,
      notes: (form.get('notes') as string) || null,
      last_known_district: (form.get('last_known_district') as string) || null,
      last_known_state: (form.get('last_known_state') as string) || null,
      destination_school: (form.get('destination_school') as string) || null,
      destination_district: (form.get('destination_district') as string) || null,
      destination_state: (form.get('destination_state') as string) || null,
    };
    try {
      await saveSchoolingRecord(record);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="School / Institution Name" name="school_name" defaultValue={initialData?.school_name || ''} placeholder="e.g. Utkal Government High School" />
        <Input label="Grade / Standard" name="grade_level" defaultValue={initialData?.grade_level || ''} placeholder="e.g. Class 5" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Select label="Enrollment Status" name="enrollment_status" defaultValue={initialData?.enrollment_status || 'enrolled'}>
          <option value="enrolled">Enrolled</option>
          <option value="not_enrolled">Not Enrolled</option>
          <option value="discontinued">Discontinued</option>
          <option value="unknown">Unknown</option>
        </Select>
        <Input label="Attendance %" name="attendance_percent" type="number" min="0" max="100" defaultValue={initialData?.attendance_percent?.toString() || ''} placeholder="90" />
        <Input label="Instruction Language" name="language_of_instruction" defaultValue={initialData?.language_of_instruction || 'Odia'} placeholder="Odia, English, Hindi" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Current District" name="last_known_district" defaultValue={initialData?.last_known_district || ''} placeholder="e.g. Balangir" />
        <Input label="Current State" name="last_known_state" defaultValue={initialData?.last_known_state || 'Odisha'} placeholder="e.g. Odisha" />
      </div>
      <p className="text-xs font-medium text-slate-500">Transfer Destination (if child is moving)</p>
      <div className="grid grid-cols-3 gap-4">
        <Input label="Destination School" name="destination_school" defaultValue={initialData?.destination_school || ''} placeholder="School name at destination" />
        <Input label="Destination District" name="destination_district" defaultValue={initialData?.destination_district || ''} placeholder="e.g. Raipur" />
        <Input label="Destination State" name="destination_state" defaultValue={initialData?.destination_state || ''} placeholder="e.g. Chhattisgarh" />
      </div>
      <Input label="Last Verified Date" name="last_verified_at" type="date" defaultValue={initialData?.last_verified_at || new Date().toISOString().slice(0, 10)} />
      <Textarea label="Educational Notes" name="notes" rows={2} defaultValue={initialData?.notes || ''} placeholder="Special learning needs, mid-day meal status, exam results" />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Schooling Info'}
        </Button>
      </div>
    </form>
  );
}

function TransferCertificateForm({
  childId,
  schooling,
  onSaved,
  saving,
  setSaving,
}: {
  childId: string;
  schooling: SchoolingRecord | null;
  onSaved: () => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      await issueTransferCertificate({
        childId,
        id: schooling?.id,
        transferCertificateDate: form.get('tc_date') as string,
        destinationSchool: (form.get('destination_school') as string) || schooling?.destination_school || null,
        destinationDistrict: (form.get('destination_district') as string) || schooling?.destination_district || null,
        destinationState: (form.get('destination_state') as string) || schooling?.destination_state || null,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
        <p className="text-sm text-blue-800 font-medium">Mark Transfer Certificate as Issued</p>
        <p className="text-xs text-blue-700 mt-1">
          This records that the origin school has issued the TC. The child can now enroll at the destination school.
        </p>
      </div>
      <Input label="TC Issue Date" name="tc_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      <div className="grid grid-cols-3 gap-4">
        <Input label="Destination School" name="destination_school" defaultValue={schooling?.destination_school || ''} placeholder="School name" />
        <Input label="Destination District" name="destination_district" defaultValue={schooling?.destination_district || ''} placeholder="District" />
        <Input label="Destination State" name="destination_state" defaultValue={schooling?.destination_state || ''} placeholder="State" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Mark TC as Issued ✓'}
        </Button>
      </div>
    </form>
  );
}
