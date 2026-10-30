import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users, MapPin, AlertTriangle, Filter, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  RISK_COLORS, RISK_LEVEL_LABELS, STATUS_COLORS, CHILD_STATUS_LABELS, GENDER_LABELS,
} from '@/lib/constants';
import { calculateAge, formatDate } from '@/lib/utils';
import { fetchChildren, createChild } from '@/features/children/api';
import { fetchCenters } from '@/features/centers/api';
import type { Child, Center, ChildStatus, RiskLevel, Gender } from '@/types';
import type { Route } from '@/components/Layout';

interface ChildrenRegistryProps {
  onNavigate?: (route: Route, childId?: string) => void;
}

export function ChildrenRegistry({ onNavigate }: ChildrenRegistryProps) {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadChildren();
    void fetchCenters().then(setCenters).catch(console.error);
  }, []);

  async function loadChildren() {
    setLoading(true);
    try {
      const data = await fetchChildren();
      setChildren(data);
    } catch (err) {
      console.error('Error fetching children:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = children.filter((c) => {
    if (search && !c.full_name.toLowerCase().includes(search.toLowerCase()) && !c.district.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (riskFilter !== 'all' && c.risk_level !== riskFilter) return false;
    return true;
  });

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const child = {
      full_name: form.get('full_name') as string,
      date_of_birth: form.get('date_of_birth') as string,
      gender: form.get('gender') as Gender,
      district: form.get('district') as string,
      status: form.get('status') as ChildStatus,
      risk_level: form.get('risk_level') as RiskLevel,
      center_id: (form.get('center_id') as string) || null,
      guardian_name: (form.get('guardian_name') as string) || null,
      guardian_phone: (form.get('guardian_phone') as string) || null,
      admission_date: (form.get('admission_date') as string) || null,
      notes: (form.get('notes') as string) || null,
    };
    try {
      const data = await createChild(child);
      setShowAdd(false);
      if (data) void loadChildren();
    } catch (err) {
      console.error('Error adding child:', err);
    } finally {
      setSaving(false);
    }
  }

  const handleSelectChild = (id: string) => {
    if (onNavigate) {
      onNavigate('child-detail', id);
    } else {
      navigate(`/children/${id}`);
    }
  };

  return (
    <div className="px-5 py-6 sm:px-8 sm:py-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Children Registry</h1>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-bold text-slate-700">
              {children.length} Total
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Centralized index tracking children across state borders, seasonal migrations, and local centers.
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="self-start sm:self-auto shadow-sm">
          <Plus size={16} />
          <span>Register Child</span>
        </Button>
      </div>

      {/* Modern Filter Ribbon */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by child's name, district, or guardian…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            <Filter size={13} className="text-teal-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by child status"
              className="bg-transparent text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="in_care">In Care</option>
              <option value="reunified">Reunified</option>
              <option value="transferred">Transferred</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            <AlertTriangle size={13} className="text-amber-500" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              aria-label="Filter by risk level"
              className="bg-transparent text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Priority</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-teal-500 border-t-transparent" />
          <p className="text-xs text-slate-400">Loading records…</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <EmptyState
            icon={<Users size={32} />}
            title="No children match your query"
            description={
              search || statusFilter !== 'all' || riskFilter !== 'all'
                ? 'Try broadening your search term or resetting your status/risk filters.'
                : 'No children are registered yet in this system. Register a child to begin tracking continuity.'
            }
            action={
              !search && statusFilter === 'all' && riskFilter === 'all' ? (
                <Button onClick={() => setShowAdd(true)}>
                  <Plus size={16} /> Register Child
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Child Profile</th>
                  <th className="px-6 py-4">Age / Gender</th>
                  <th className="px-6 py-4">Current District</th>
                  <th className="px-6 py-4">Assigned Institution</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((child) => (
                  <tr
                    key={child.id}
                    onClick={() => handleSelectChild(child.id)}
                    className="group cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <Avatar name={child.full_name} size="md" />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {child.full_name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Admitted {formatDate(child.admission_date)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-700">{calculateAge(child.date_of_birth)} yrs</p>
                      <p className="text-xs text-slate-400">{GENDER_LABELS[child.gender]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <MapPin size={14} className="text-teal-600 shrink-0" />
                        <span>{child.district}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 font-medium">{child.center?.name || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${STATUS_COLORS[child.status]} font-semibold text-xs px-2.5 py-0.5`}>
                        {CHILD_STATUS_LABELS[child.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${RISK_COLORS[child.risk_level]} font-semibold text-xs px-2.5 py-0.5 flex items-center gap-1 w-fit`}>
                        {child.risk_level === 'critical' && <AlertTriangle size={12} />}
                        {RISK_LEVEL_LABELS[child.risk_level]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 group-hover:text-teal-700 group-hover:bg-teal-50 transition-all">
                        <ChevronRight size={16} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add child modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Register New Child" size="lg">
        <form onSubmit={handleAdd} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full Name" name="full_name" required placeholder="e.g. Aarav Nayak" />
            <Input label="Date of Birth" name="date_of_birth" type="date" required />
            <Select label="Gender" name="gender" required defaultValue="male">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <Input label="Current District" name="district" required placeholder="e.g. Khurda, Cuttack" />
            <Select label="Case Status" name="status" defaultValue="in_care">
              <option value="active">Active Monitoring</option>
              <option value="in_care">Under Institutional Care</option>
              <option value="reunified">Reunified with Family</option>
              <option value="transferred">Inter-district Transferred</option>
              <option value="closed">Closed Case</option>
            </Select>
            <Select label="Risk Assessment" name="risk_level" defaultValue="low">
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Priority</option>
            </Select>
            <Select label="Assigned Institution / Shelter" name="center_id">
              <option value="">No center assigned (Community)</option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district})
                </option>
              ))}
            </Select>
            <Input label="Admission Date" name="admission_date" type="date" />
            <Input label="Guardian Name" name="guardian_name" placeholder="Mother, Father, or Relative" />
            <Input label="Guardian Contact Phone" name="guardian_phone" placeholder="+91-9876543210" />
          </div>
          <Textarea
            label="Intake & Social Investigation Notes"
            name="notes"
            rows={3}
            placeholder="Family relocation context, education history, special pediatric or emotional needs..."
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Registering…' : 'Save Record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
