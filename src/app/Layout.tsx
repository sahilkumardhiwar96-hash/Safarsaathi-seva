import { type ReactNode, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Users, ArrowLeftRight, Building2, Heart, Menu, X, ChevronRight } from 'lucide-react';

export type Route = 'dashboard' | 'children' | 'child-detail' | 'handoffs' | 'centers';

interface LayoutProps {
  route?: Route;
  onNavigate?: (route: Route) => void;
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/children', label: 'Children Registry', icon: Users, badge: null },
  { path: '/handoffs', label: 'Location Handoffs', icon: ArrowLeftRight, badge: null },
  { path: '/centers', label: 'Childcare Directory', icon: Building2, badge: null },
];

export function Layout({ route, onNavigate, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col lg:flex-row font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950 border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-md shadow-teal-500/20">
                  <ShieldCheck size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-white tracking-tight">MMS Suraksha</p>
                  <p className="text-[11px] font-medium text-teal-400/90 tracking-wide uppercase">Child Continuity</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Department Label */}
            <div className="px-6 pt-5 pb-2">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Navigation</p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isMatch =
                  item.path === '/'
                    ? location.pathname === '/' || route === 'dashboard'
                    : location.pathname.startsWith(item.path) ||
                      (item.path === '/children' && (route === 'children' || route === 'child-detail')) ||
                      (item.path === '/handoffs' && route === 'handoffs') ||
                      (item.path === '/centers' && route === 'centers');

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setSidebarOpen(false);
                      if (onNavigate) {
                        if (item.path === '/') onNavigate('dashboard');
                        else if (item.path === '/children') onNavigate('children');
                        else if (item.path === '/handoffs') onNavigate('handoffs');
                        else if (item.path === '/centers') onNavigate('centers');
                      }
                    }}
                    className={`group relative flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                      isMatch
                        ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-300 shadow-sm border border-teal-500/30 font-semibold'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isMatch ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30' : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    {isMatch ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-sm shadow-teal-400" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 m-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
                <Heart size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">Vulnerable Child Tracker</p>
                <p className="text-[10px] text-slate-400 truncate">Active Inter-District Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top header bar */}
        <div className="sticky top-11 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
              <ShieldCheck size={18} />
            </div>
            <span className="font-bold text-slate-900 text-sm">MMS Suraksha</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
