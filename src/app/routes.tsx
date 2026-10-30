import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { ChildrenRegistry } from '@/pages/ChildrenRegistry';
import { ChildDetail } from '@/pages/ChildDetail';
import { HandoffsPage } from '@/pages/HandoffsPage';
import { CentersPage } from '@/pages/CentersPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/children" element={<ChildrenRegistry />} />
      <Route path="/children/:id" element={<ChildDetail />} />
      <Route path="/handoffs" element={<HandoffsPage />} />
      <Route path="/centers" element={<CentersPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
