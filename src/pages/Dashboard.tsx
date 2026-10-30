import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, HeartHandshake, ArrowLeftRight, TrendingUp, Activity, Building2, Clock, ShieldAlert, ArrowUpRight, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { RISK_COLORS, RISK_LEVEL_LABELS, HANDOFF_STATUS_COLORS, HANDOFF_STATUS_LABELS, HANDOFF_TYPE_LABELS, NOTE_STATUS_COLORS, NOTE_STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/constants';
import { formatRelativeDate, calculateAge } from '@/lib/utils';
import { fetchDashboardData, type DashboardStats } from '@/features/dashboard/api';
import type { Child, Handoff, CaseNote } from '@/types';
import type { Route } from '@/components/Layout';

interface DashboardProps {
  onNavigate?: (route: Route, childId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentChildren, setRecentChildren] = useState<Child[]>([]);
  const [pendingHandoffs, setPendingHandoffs] = useState<Handoff[]>([]);
  const [urgentCases, setUrgentCases] = useState<CaseNote[]>([]);
  const [lostCaseChildren, setLostCaseChildren] = useState<Child[]>([]);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDashboardData();
        setStats(data.stats);
        setRecentChildren(data.recentChildren);
        setPendingHandoffs(data.pendingHandoffs);
        setUrgentCases(data.urgentCases);
        setLostCaseChildren(data.lostCases);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const goTo = (route: Route, childId?: string) => {
    if (onNavigate) {
      onNavigate(route, childId);
    } else {
      if (route === 'child-detail' && childId) navigate(`/children/${childId}`);
      else if (route === 'children') navigate('/children');
      else if (route === 'handoffs') navigate('/handoffs');
      else if (route === 'centers') navigate('/centers');
      else navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-teal-500 border-t-transparent shadow-md" />
        <p className="text-xs font-medium text-slate-400 tracking-wide">Aggregating district case data…</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Registered Children',
      value: stats?.totalChildren ?? 0,
      sublabel: 'Across all districts',
      icon: Users,
      gradient: 'from-teal-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-teal-500/20',
      iconBg: 'bg-teal-500 text-white shadow-md shadow-teal-500/30',
    },
    {
      label: 'Critical Priority',
      value: stats?.criticalRisk ?? 0,
      sublabel: 'Immediate intervention needed',
      icon: AlertTriangle,
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-500/20',
      iconBg: 'bg-rose-500 text-white shadow-md shadow-rose-500/30',
    },
    {
      label: 'Under Institutional Care',
      value: stats?.inCare ?? 0,
      sublabel: 'Active shelter & CCI placements',
      icon: HeartHandshake,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      borderColor: 'border-blue-500/20',
      iconBg: 'bg-blue-600 text-white shadow-md shadow-blue-500/30',
    },
    {
      label: 'Pending Handoffs',
      value: stats?.pendingHandoffs ?? 0,
      sublabel: 'Awaiting transfer verification',
      icon: ArrowLeftRight,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/20',
      iconBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/30',
    },
  ];

  return (
    <div className="px-5 py-6 sm:px-8 sm:py-8 max-w-7xl mx-auto space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Operations Dashboard</h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time child continuity, inter-district migrations, and protection case coordination.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => goTo('children')}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-teal-600/30 hover:bg-teal-700 transition-all hover:shadow"
          >
            <Users size={15} />
            <span>Child Registry</span>
          </button>
        </div>
      </div>

      {/* GAP 3: Lost Case Alert Banner */}
      {!alertDismissed && lostCaseChildren.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-rose-300 bg-gradient-to-r from-rose-50 via-rose-50/80 to-amber-50/50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/20">
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Movement Alert</span>
                  <span className="h-1 w-1 rounded-full bg-rose-400" />
                  <span className="text-xs font-medium text-rose-600">Immediate Action Required</span>
                </div>
                <h2 className="mt-0.5 text-sm font-bold text-rose-950 sm:text-base">
                  {lostCaseChildren.length} High-Risk {lostCaseChildren.length === 1 ? 'child is' : 'children are'} untracked following recent relocation
                </h2>
                <p className="mt-1 text-xs text-rose-800 leading-relaxed max-w-3xl">
                  These children moved districts within the past 30 days without an official transfer order or handoff record. Please open their file, review the <strong>Family &amp; Migration</strong> record, and designate a receiving officer.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lostCaseChildren.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => goTo('child-detail', child.id)}
                      className="group inline-flex items-center gap-2 rounded-lg bg-white/90 border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-900 shadow-xs hover:bg-white hover:border-rose-300 hover:shadow-sm transition-all"
                    >
                      <span>{child.full_name}</span>
                      <span className="text-rose-400 group-hover:text-rose-600 font-normal">({child.district})</span>
                      <ArrowUpRight size={13} className="text-rose-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              className="shrink-0 rounded-lg p-1.5 text-rose-500 hover:bg-rose-100 transition-colors"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{card.value}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{card.sublabel}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recently Added Children */}
        <Card className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Users size={16} />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Recently Registered Children</h2>
            </div>
            <button
              onClick={() => goTo('children')}
              className="group inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              <span>View directory</span>
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 bg-white">
            {recentChildren.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No children registered yet.</div>
            ) : (
              recentChildren.map((child) => (
                <button
                  key={child.id}
                  onClick={() => goTo('child-detail', child.id)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-slate-50/80 transition-colors group"
                >
                  <Avatar name={child.full_name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {child.full_name}
                      </p>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs font-medium text-slate-500">{calculateAge(child.date_of_birth)} yrs</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      District: <span className="text-slate-600 font-medium">{child.district}</span> · Admitted {formatRelativeDate(child.created_at)}
                    </p>
                  </div>
                  <Badge className={`${RISK_COLORS[child.risk_level]} text-xs font-semibold px-2.5 py-1`}>
                    {RISK_LEVEL_LABELS[child.risk_level]}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Urgent Protection Cases */}
        <Card className="overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle size={16} />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Urgent Case Follow-ups</h2>
          </div>
          <div className="divide-y divide-slate-100 bg-white">
            {urgentCases.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Activity size={20} />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-600">No open critical cases</p>
                <p className="text-[11px] text-slate-400">All high priority reviews resolved</p>
              </div>
            ) : (
              urgentCases.map((note) => (
                <button
                  key={note.id}
                  onClick={() => goTo('child-detail', note.child_id)}
                  className="block w-full px-6 py-4 text-left hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {note.child?.full_name || 'Assigned Child'}
                    </p>
                    <Badge className={`${PRIORITY_COLORS[note.priority]} text-[10px] uppercase font-bold tracking-wider`}>
                      {PRIORITY_LABELS[note.priority]}
                    </Badge>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-600 leading-relaxed">{note.body}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <Badge className={`${NOTE_STATUS_COLORS[note.status]} text-[10px]`}>
                      {NOTE_STATUS_LABELS[note.status]}
                    </Badge>
                    <span className="text-slate-400">{formatRelativeDate(note.note_date)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Pending Handoffs Card */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Pending Inter-Center Transfers</h2>
              <p className="text-[11px] text-slate-400">Transfers awaiting receiving institution confirmation</p>
            </div>
          </div>
          <button
            onClick={() => goTo('handoffs')}
            className="group inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <span>View all transfers</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        {pendingHandoffs.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-xs font-medium text-slate-500">No pending transfers awaiting escort</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 bg-white">
            {pendingHandoffs.map((h) => (
              <button
                key={h.id}
                onClick={() => goTo('child-detail', h.child_id)}
                className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-slate-50/80 transition-colors group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <ArrowLeftRight size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {h.child?.full_name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {HANDOFF_TYPE_LABELS[h.handoff_type]} · Initiated {formatRelativeDate(h.handoff_date)}
                  </p>
                </div>
                <Badge className={`${HANDOFF_STATUS_COLORS[h.status]} text-xs font-semibold`}>
                  {HANDOFF_STATUS_LABELS[h.status]}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Summary Footer Badges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats?.reunified ?? 0}</p>
            <p className="text-xs font-medium text-slate-500">Successful Family Reunifications</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats?.totalCenters ?? 0}</p>
            <p className="text-xs font-medium text-slate-500">Active CCIs &amp; Care Centers</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats?.openCases ?? 0}</p>
            <p className="text-xs font-medium text-slate-500">Active Case Inquiries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
