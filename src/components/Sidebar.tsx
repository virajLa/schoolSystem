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
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  userRole: Role;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount: number;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  onSelectTab,
  pendingApprovalsCount,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
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
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:min-h-[calc(100vh-4rem)] lg:flex`}
    >
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex flex-col gap-1 overflow-hidden">
          <span className="text-3xs uppercase font-extrabold tracking-widest text-emerald-400 font-display">Authorized Sector</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 truncate font-display">{userRole}</span>
          </div>
        </div>
        {onCloseMobile && (
          <button
            type="button"
            id="btn-close-mobile-sidebar"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/50 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
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

      {/* Sidebar Logout Action */}
      <div className="p-4 border-t border-slate-800 text-3xs text-slate-500 flex flex-col gap-2">
        <p className="font-bold text-slate-400 font-display uppercase tracking-wider">SchoolFlow Core</p>
        <button
          id="btn-sidebar-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800/60 rounded-lg transition-colors font-semibold cursor-pointer text-left"
        >
          <LogOut className="h-4 w-4 text-rose-400" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
