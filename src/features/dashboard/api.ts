import { supabase } from '@/lib/supabase';
import type { Child, Handoff, CaseNote } from '@/types';

export interface DashboardStats {
  totalChildren: number;
  criticalRisk: number;
  inCare: number;
  reunified: number;
  pendingHandoffs: number;
  openCases: number;
  totalCenters: number;
}

export async function fetchDashboardData() {
  const [childrenRes, handoffsRes, casesRes, casesCountRes, centersRes] = await Promise.all([
    supabase.from('children').select('*').order('created_at', { ascending: false }),
    supabase.from('handoffs').select('*, child:children(*), from_center:centers!from_center_id(*), to_center:centers!to_center_id(*)').eq('status', 'pending').order('handoff_date', { ascending: true }),
    supabase.from('case_notes').select('*, child:children(*)').in('status', ['open', 'in_progress']).in('priority', ['high', 'urgent']).order('note_date', { ascending: false }).limit(5),
    supabase.from('case_notes').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']).in('priority', ['high', 'urgent']),
    supabase.from('centers').select('*', { count: 'exact', head: true }),
  ]);

  const children = (childrenRes.data || []) as Child[];
  const pendingHandoffs = (handoffsRes.data || []) as Handoff[];
  const urgentCases = (casesRes.data || []) as CaseNote[];

  const stats: DashboardStats = {
    totalChildren: children.length,
    criticalRisk: children.filter(c => c.risk_level === 'critical').length,
    inCare: children.filter(c => c.status === 'in_care').length,
    reunified: children.filter(c => c.status === 'reunified').length,
    pendingHandoffs: pendingHandoffs.length,
    openCases: casesCountRes.count ?? urgentCases.length,
    totalCenters: centersRes.count || 0,
  };

  // GAP 3: Detect high-risk children who moved without a case handoff or transfer.
  // Uses two bulk queries instead of N+1 sequential round-trips.
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);

  const highRiskChildren = children.filter(c => c.risk_level === 'high' || c.risk_level === 'critical');

  const highRiskIds = highRiskChildren.map(c => c.id);

  const [{ data: allMigrations }, { data: allHandoffs }] = await Promise.all([
    supabase
      .from('migration_events')
      .select('child_id')
      .in('child_id', highRiskIds)
      .eq('case_transferred', false)
      .gte('event_date', thirtyDaysAgoStr),
    supabase
      .from('handoffs')
      .select('child_id')
      .in('child_id', highRiskIds)
      .gte('handoff_date', thirtyDaysAgoStr),
  ]);

  const migratedIds = new Set((allMigrations || []).map(m => m.child_id as string));
  const handoffIds  = new Set((allHandoffs  || []).map(h => h.child_id as string));

  const lostCases = highRiskChildren.filter(
    c => migratedIds.has(c.id) && !handoffIds.has(c.id)
  );

  return {
    stats,
    recentChildren: children.slice(0, 5),
    pendingHandoffs,
    urgentCases,
    lostCases,
  };
}
