import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { HANDOFF_STATUS_COLORS, HANDOFF_STATUS_LABELS, HANDOFF_TYPE_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { fetchHandoffs, markHandoffCompleted } from '@/features/handoffs/api';
import type { Handoff, HandoffStatus } from '@/types';
import type { Route } from '@/components/Layout';

interface HandoffsPageProps {
  onNavigate?: (route: Route, childId?: string) => void;
}

export function HandoffsPage({ onNavigate }: HandoffsPageProps) {
  const navigate = useNavigate();
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHandoffs();
      setHandoffs(data);
    } catch (err) {
      console.error('Error loading handoffs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function updateStatus(h: Handoff, status: HandoffStatus) {
    if (status === 'completed') {
      await markHandoffCompleted(h.id);
    } else {
      await supabase.from('handoffs').update({ status }).eq('id', h.id);
    }
    void load();
  }

  const goToChild = (childId?: string) => {
    if (!childId) return;
    if (onNavigate) {
      onNavigate('child-detail', childId);
    } else {
      navigate(`/children/${childId}`);
    }
  };

  const filtered = filter === 'all' ? handoffs : handoffs.filter(h => h.status === filter);

  const counts = {
    all: handoffs.length,
    pending: handoffs.filter(h => h.status === 'pending').length,
    completed: handoffs.filter(h => h.status === 'completed').length,
    cancelled: handoffs.filter(h => h.status === 'cancelled').length,
  };

  const filterTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Location Handoffs</h1>
        <p className="mt-1 text-sm text-slate-500">Track transfers, reunifications, and referrals across centers</p>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {filterTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${filter === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.label} <span className="ml-1 text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-teal-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={<ArrowLeftRight size={28} />} title="No handoffs found" description="Handoffs will appear here when children are transferred, reunified, or referred" /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => (
            <Card key={h.id} className="p-5">
              <div className="flex items-start gap-4">
                <Avatar name={h.child?.full_name || '?'} size="sm" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => goToChild(h.child_id)} className="text-sm font-semibold text-slate-900 hover:text-teal-600">
                      {h.child?.full_name}
                    </button>
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">{HANDOFF_TYPE_LABELS[h.handoff_type]}</Badge>
                    <Badge className={HANDOFF_STATUS_COLORS[h.status]}>{HANDOFF_STATUS_LABELS[h.status]}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">{h.reason || 'No reason provided'}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-slate-700">{h.from_center?.name || 'External'}</span>
                    <ArrowRight size={16} className="text-slate-400" />
                    <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-slate-700">{h.to_center?.name || 'Family / External'}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(h.handoff_date)}</span>
                    {h.receiving_person && <span>Receiver: {h.receiving_person}</span>}
                    {h.initiated_by && <span>Initiated by: {h.initiated_by}</span>}
                  </div>
                  {h.notes && <p className="mt-2 text-sm text-slate-500 italic">{h.notes}</p>}
                </div>
                {h.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="secondary" onClick={() => updateStatus(h, 'completed')}>
                      <CheckCircle2 size={14} /> Complete
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(h, 'cancelled')}>
                      <XCircle size={14} /> Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
