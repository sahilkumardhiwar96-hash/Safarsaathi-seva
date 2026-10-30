import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, MapPin, Users, Plus, Baby, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/EmptyState';
import { CENTER_TYPE_LABELS, CENTER_STATUS_COLORS, CENTER_STATUS_LABELS } from '@/lib/constants';
import { fetchCenters, createCenter } from '@/features/centers/api';
import { fetchChildcareDirectory } from '@/features/childcare/api';
import type { Center, CenterType, CenterStatus, ChildcareDirectoryItem, ChildcareServiceType } from '@/types';
import type { Route } from '@/components/Layout';

interface CentersPageProps {
  onNavigate?: (route: Route, childId?: string) => void;
}

const SERVICE_TYPE_LABELS: Record<ChildcareServiceType, string> = {
  anganwadi: 'Anganwadi',
  school: 'School',
  health: 'Health Centre',
  shelter: 'Shelter',
  counselling: 'Counselling',
  creche: 'Creche',
  daycare: 'Daycare',
  other: 'Other',
};

const SERVICE_TYPE_COLORS: Record<ChildcareServiceType, string> = {
  anganwadi: 'bg-orange-100 text-orange-700 border-orange-200',
  school: 'bg-blue-100 text-blue-700 border-blue-200',
  health: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  shelter: 'bg-purple-100 text-purple-700 border-purple-200',
  counselling: 'bg-teal-100 text-teal-700 border-teal-200',
  creche: 'bg-pink-100 text-pink-700 border-pink-200',
  daycare: 'bg-amber-100 text-amber-700 border-amber-200',
  other: 'bg-slate-100 text-slate-700 border-slate-200',
};

type PageTab = 'centers' | 'childcare';

export function CentersPage({ onNavigate }: CentersPageProps) {
  const navigate = useNavigate();
  const [pageTab, setPageTab] = useState<PageTab>('centers');

  // Centers state
  const [centers, setCenters] = useState<(Center & { child_count?: number })[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  // Childcare Finder state
  const [childcareItems, setChildcareItems] = useState<ChildcareDirectoryItem[]>([]);
  const [loadingChildcare, setLoadingChildcare] = useState(false);
  const [districtFilter, setDistrictFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<ChildcareServiceType | ''>('');

  const loadCenters = useCallback(async () => {
    setLoadingCenters(true);
    try {
      const data = await fetchCenters();
      setCenters(data);
    } catch (err) {
      console.error('Error fetching centers:', err);
    } finally {
      setLoadingCenters(false);
    }
  }, []);

  const loadChildcare = useCallback(async () => {
    setLoadingChildcare(true);
    try {
      const data = await fetchChildcareDirectory({
        district: districtFilter,
        serviceType: typeFilter,
      });
      setChildcareItems(data);
    } catch (err) {
      console.error('Error fetching childcare:', err);
    } finally {
      setLoadingChildcare(false);
    }
  }, [districtFilter, typeFilter]);

  useEffect(() => { void loadCenters(); }, [loadCenters]);
  useEffect(() => { if (pageTab === 'childcare') void loadChildcare(); }, [pageTab, loadChildcare]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const center = {
      name: form.get('name') as string,
      type: form.get('type') as CenterType,
      district: form.get('district') as string,
      capacity: Number(form.get('capacity')) || 0,
      contact_phone: (form.get('contact_phone') as string) || null,
      status: form.get('status') as CenterStatus,
    };
    try {
      await createCenter(center);
      setShowAdd(false);
      void loadCenters();
    } finally {
      setSaving(false);
    }
  }

  const goToChildren = () => {
    if (onNavigate) {
      onNavigate('children');
    } else {
      navigate('/children');
    }
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Childcare Directory</h1>
          <p className="mt-1 text-sm text-slate-500">Centers, creches, and community childcare services</p>
        </div>
        {pageTab === 'centers' && (
          <Button onClick={() => setShowAdd(true)}><Plus size={18} /> Add Center</Button>
        )}
      </div>

      {/* Tab switcher */}
      <div className="mb-6 flex gap-1 border-b border-slate-200">
        <button
          onClick={() => setPageTab('centers')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${pageTab === 'centers' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Building2 size={16} /> Institutional Centers
        </button>
        <button
          onClick={() => setPageTab('childcare')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${pageTab === 'childcare' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Baby size={16} /> Childcare Finder
        </button>
      </div>

      {/* Institutional Centers tab */}
      {pageTab === 'centers' && (
        <>
          {loadingCenters ? (
            <div className="flex items-center justify-center py-32">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-teal-500 border-t-transparent" />
            </div>
          ) : centers.length === 0 ? (
            <Card><EmptyState icon={<Building2 size={28} />} title="No centers registered" description="Add a childcare institution, aftercare, or community center to get started" action={<Button onClick={() => setShowAdd(true)}><Plus size={16} /> Add Center</Button>} /></Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {centers.map((center) => (
                <Card key={center.id} className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                        <Building2 size={22} className="text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{center.name}</h3>
                        <p className="text-xs text-slate-500">{CENTER_TYPE_LABELS[center.type]}</p>
                      </div>
                    </div>
                    <Badge className={CENTER_STATUS_COLORS[center.status]}>{CENTER_STATUS_LABELS[center.status]}</Badge>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600"><MapPin size={15} className="text-slate-400" /> {center.district}</div>
                    {center.contact_phone && <div className="flex items-center gap-2 text-slate-600"><Phone size={15} className="text-slate-400" /> {center.contact_phone}</div>}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{center.child_count ?? 0} children</span>
                    </div>
                    <span className="text-xs text-slate-400">Capacity: {center.capacity}</span>
                  </div>
                  {(center.child_count ?? 0) > 0 && (
                    <button onClick={goToChildren} className="mt-2 w-full rounded-lg bg-slate-50 py-2 text-sm font-medium text-teal-600 hover:bg-slate-100 transition-colors">
                      View children →
                    </button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Childcare Finder tab */}
      {pageTab === 'childcare' && (
        <div>
          {/* Info banner */}
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              🍼 Childcare Finder — for migrant &amp; seasonal worker families
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Find nearby creches, daycares, and anganwadis where young children can be safely cared for while parents work. Filter by district to locate services close to the worksite.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Filter by district (e.g. Bargarh, Khurda, Bolangir)..."
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="flex-1 py-2.5 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ChildcareServiceType | '')}
              aria-label="Filter by service type"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
            >
              <option value="">All types</option>
              <option value="creche">Creche</option>
              <option value="daycare">Daycare</option>
              <option value="anganwadi">Anganwadi</option>
              <option value="health">Health Centre</option>
              <option value="counselling">Counselling</option>
              <option value="shelter">Shelter</option>
              <option value="other">Other</option>
            </select>
            <Button variant="secondary" onClick={() => void loadChildcare()}>
              <Search size={16} /> Search
            </Button>
          </div>

          {loadingChildcare ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-teal-500 border-t-transparent" />
            </div>
          ) : childcareItems.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Baby size={28} />}
                title="No childcare services found"
                description={districtFilter ? `No services found in ${districtFilter}. Try a different district or clear the filter.` : 'No childcare services are registered yet.'}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {childcareItems.map((item) => (
                <Card key={item.id} className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                        <Baby size={20} className="text-pink-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">{item.name}</h3>
                      </div>
                    </div>
                    <Badge className={SERVICE_TYPE_COLORS[item.service_type]}>
                      {SERVICE_TYPE_LABELS[item.service_type]}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={14} className="shrink-0 text-slate-400" />
                      <span>{item.district}{item.address ? ` · ${item.address}` : ''}</span>
                    </div>
                    {item.contact_phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={14} className="shrink-0 text-slate-400" />
                        <a href={`tel:${item.contact_phone}`} className="font-medium text-teal-700 hover:underline">{item.contact_phone}</a>
                      </div>
                    )}
                    {item.languages && item.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.languages.map((lang) => (
                          <span key={lang} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{lang}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Center">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Center Name" name="name" required placeholder="e.g. Ashray Children's Home" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" name="type" defaultValue="cci">
              <option value="cci">Childcare Institution</option>
              <option value="aftercare">Aftercare</option>
              <option value="community">Community Center</option>
              <option value="shelter">Shelter</option>
            </Select>
            <Input label="District" name="district" required placeholder="e.g. North Delhi" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Capacity" name="capacity" type="number" defaultValue="0" />
            <Select label="Status" name="status" defaultValue="active">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="at_capacity">At Capacity</option>
            </Select>
          </div>
          <Input label="Contact Phone" name="contact_phone" placeholder="+91-..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Center'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
