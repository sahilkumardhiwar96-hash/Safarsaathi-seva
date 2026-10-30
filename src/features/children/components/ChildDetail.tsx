import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, ClipboardList, Scale, ArrowLeftRight, Shield, MapPin, Calendar,
  User, Users, BookOpen,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { RISK_COLORS, RISK_LEVEL_LABELS, STATUS_COLORS, CHILD_STATUS_LABELS, GENDER_LABELS } from '@/lib/constants';
import { calculateAge } from '@/lib/utils';
import { fetchChildById } from '@/features/children/api';
import { fetchCenters } from '@/features/centers/api';
import { fetchHealthRecords } from '@/features/health/api';
import { fetchCaseNotes } from '@/features/protection/api';
import { fetchHandoffs } from '@/features/handoffs/api';
import { fetchConsents } from '@/features/consents/api';
import { fetchFamilyLinks, fetchMigrationEvents } from '@/features/families/api';
import { fetchSchoolingRecord } from '@/features/schooling/api';

import { OverviewTab } from './OverviewTab';
import { HealthTab } from '@/features/health/components/HealthTab';
import { ProtectionTab } from '@/features/protection/components/ProtectionTab';
import { FamilyTab } from '@/features/families/components/FamilyTab';
import { SchoolingTab } from '@/features/schooling/components/SchoolingTab';
import { ConsentTab } from '@/features/consents/components/ConsentTab';
import { HandoffsTab } from '@/features/handoffs/components/HandoffsTab';
import { JourneyTab } from './JourneyTab';

import type {
  Child, Center, HealthRecord, CaseNote, Handoff, Consent,
  FamilyLink, MigrationEvent, SchoolingRecord,
} from '@/types';

type Tab = 'overview' | 'health' | 'protection' | 'family' | 'education' | 'consent' | 'handoffs' | 'journey';

interface ChildDetailProps {
  childId?: string;
  onNavigate?: (route: string, childId?: string) => void;
}

export function ChildDetail({ childId: propChildId, onNavigate }: ChildDetailProps) {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const childId = propChildId || params.id || '';

  const [child, setChild] = useState<Child | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [familyLinks, setFamilyLinks] = useState<FamilyLink[]>([]);
  const [migrationEvents, setMigrationEvents] = useState<MigrationEvent[]>([]);
  const [schooling, setSchooling] = useState<SchoolingRecord | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!childId) return;
    try {
      const [
        childData,
        centersData,
        healthData,
        notesData,
        handoffsData,
        consentsData,
        familyData,
        migrationData,
        schoolingData,
      ] = await Promise.all([
        fetchChildById(childId),
        fetchCenters(),
        fetchHealthRecords(childId),
        fetchCaseNotes(childId),
        fetchHandoffs(childId),
        fetchConsents(childId),
        fetchFamilyLinks(childId),
        fetchMigrationEvents(childId),
        fetchSchoolingRecord(childId),
      ]);

      setChild(childData);
      setCenters(centersData);
      setHealthRecords(healthData);
      setCaseNotes(notesData);
      setHandoffs(handoffsData);
      setConsents(consentsData);
      setFamilyLinks(familyData);
      setMigrationEvents(migrationData);
      setSchooling(schoolingData);
    } catch (err) {
      console.error('Error loading child detail:', err);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('children');
    } else {
      navigate('/children');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="px-6 py-6 lg:px-8">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft size={18} /> Back to Children
        </Button>
        <EmptyState icon={<User size={28} />} title="Child not found" description="This child may have been removed" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Heart; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'health', label: 'Health', icon: Heart, count: healthRecords.length },
    { id: 'protection', label: 'Case Notes', icon: ClipboardList, count: caseNotes.length },
    { id: 'family', label: 'Family & Migration', icon: Users, count: familyLinks.length + migrationEvents.length },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'consent', label: 'Consents', icon: Scale, count: consents.length },
    { id: 'handoffs', label: 'Handoffs', icon: ArrowLeftRight, count: handoffs.length },
    { id: 'journey', label: 'Journey', icon: MapPin },
  ];

  return (
    <div className="px-6 py-6 lg:px-8">
      <button
        onClick={handleBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Back to Children
      </button>

      {/* Header card */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 text-white">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
          
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="ring-4 ring-white/10 rounded-full shadow-xl">
              <Avatar name={child.full_name} size="lg" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{child.full_name}</h1>
                <Badge className={`${STATUS_COLORS[child.status]} font-semibold text-xs px-3 py-1 shadow-xs`}>
                  {CHILD_STATUS_LABELS[child.status]}
                </Badge>
                <Badge className={`${RISK_COLORS[child.risk_level]} font-semibold text-xs px-3 py-1 shadow-xs`}>
                  {RISK_LEVEL_LABELS[child.risk_level]} Risk
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={15} className="text-teal-400" />
                  {calculateAge(child.date_of_birth)} years old · {GENDER_LABELS[child.gender]}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={15} className="text-teal-400" />
                  District: {child.district}
                </span>
                {child.center && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Shield size={15} className="text-teal-400" />
                    {child.center.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="flex overflow-x-auto border-t border-slate-200 bg-slate-50/70 px-4 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'border-teal-600 text-teal-700 bg-white shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <Icon size={16} className={active ? 'text-teal-600' : 'text-slate-400'} />
                <span>{t.label}</span>
                {t.count !== undefined && t.count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      active ? 'bg-teal-100 text-teal-800' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {tab === 'overview' && (
        <OverviewTab
          child={child}
          healthRecords={healthRecords}
          caseNotes={caseNotes}
          onSelectTab={(newTab) => setTab(newTab)}
        />
      )}

      {tab === 'health' && (
        <HealthTab
          childId={child.id}
          records={healthRecords}
          onRefresh={async () => {
            const data = await fetchHealthRecords(child.id);
            setHealthRecords(data);
          }}
        />
      )}

      {tab === 'protection' && (
        <ProtectionTab
          childId={child.id}
          notes={caseNotes}
          onRefresh={async () => {
            const data = await fetchCaseNotes(child.id);
            setCaseNotes(data);
          }}
        />
      )}

      {tab === 'family' && (
        <FamilyTab
          childId={child.id}
          currentDistrict={child.district}
          familyLinks={familyLinks}
          migrationEvents={migrationEvents}
          onRefresh={async () => {
            const [links, events] = await Promise.all([
              fetchFamilyLinks(child.id),
              fetchMigrationEvents(child.id),
            ]);
            setFamilyLinks(links);
            setMigrationEvents(events);
          }}
        />
      )}

      {tab === 'education' && (
        <SchoolingTab
          childId={child.id}
          schooling={schooling}
          onRefresh={async () => {
            const data = await fetchSchoolingRecord(child.id);
            setSchooling(data);
          }}
        />
      )}

      {tab === 'consent' && (
        <ConsentTab
          childId={child.id}
          consents={consents}
          onRefresh={async () => {
            const data = await fetchConsents(child.id);
            setConsents(data);
          }}
        />
      )}

      {tab === 'handoffs' && (
        <HandoffsTab
          childId={child.id}
          currentCenterId={child.center_id}
          centers={centers}
          handoffs={handoffs}
          onRefresh={async () => {
            const data = await fetchHandoffs(child.id);
            setHandoffs(data);
          }}
        />
      )}

      {tab === 'journey' && (
        <JourneyTab
          healthRecords={healthRecords}
          caseNotes={caseNotes}
          migrationEvents={migrationEvents}
          handoffs={handoffs}
          schooling={schooling}
        />
      )}
    </div>
  );
}
