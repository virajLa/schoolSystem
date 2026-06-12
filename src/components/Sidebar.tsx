import React from 'react';
import { Role } from '../types';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Inbox,
  Clock,
  Settings,
  Users,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  userRole: Role;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  onSelectTab,
  pendingApprovalsCount,
}) => {
  const isApprover = [
    'Principal',
    'Deputy Principal',
    'Sectional Head',
    'Head of Department',
  ].includes(userRole);

  const isAdmin = ['Super Administrator', 'Principal'].includes(userRole);

  const navItems = [
    { id: 'dashboard', label: 'Overview Metrics', icon: LayoutDashboard, roles: 'all' },
    { id: 'lesson-plans', label: 'My Lesson Database', icon: FileText, roles: 'all' },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar, roles: 'all' },
    { id: 'approval-queue1', label: 'Approval Queue', icon: Inbox, roles: 'approver', badge: pendingApprovalsCount },
    { id: 'leave-requests', label: 'Leave Center', icon: Clock, roles: 'all' },
    { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp, roles: 'all' },
    { id: 'users', label: 'Officer Assignment', icon: Users, roles: 'admin' },
    { id: 'audit-logs', label: 'Audit Trail Ledger', icon: ShieldCheck, roles: 'admin' },
    { id: 'settings', label: 'System Configuration', icon: Settings, roles: 'admin' },
  ];

  const filteredItems = navItems.filter((item) => {
    if (item.roles === 'all') return true;
    if (item.roles === 'approver') return isApprover;
    if (item.roles === 'admin') return isAdmin;
    return false;
  });

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 lg:min-h-[calc(100vh-4rem)] flex flex-col border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 flex flex-col gap-1">
        <span className="text-3xs uppercase font-extrabold tracking-widest text-emerald-400 font-display">Authorized Sector</span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-100 truncate font-display">{userRole}</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'approval-queue1' && activeTab === 'approval-queue');
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => onSelectTab(item.id === 'approval-queue1' ? 'approval-queue' : item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all group select-none cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 animate-duration-150'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="font-display font-medium text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-rose-500 text-white text-3xs font-extrabold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Static environment banner - NO terminal bloat / credits. Clean info. */}
      <div className="p-4 border-t border-slate-800 text-3xs text-slate-500">
        <p className="font-bold text-slate-400 font-display uppercase tracking-wider">SchoolFlow Core</p>
        <p className="mt-0.5 text-slate-600">Vite + React 19 Workspace</p>
      </div>
    </aside>
  );
};
