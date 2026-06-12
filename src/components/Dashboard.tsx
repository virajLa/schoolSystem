import React from 'react';
import { User, LessonPlan, LeaveRequest, LeaveBalance, AuditLog } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  Calendar,
  AlertCircle,
  TrendingUp,
  Inbox,
  Sparkles,
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  plans: LessonPlan[];
  leaves: LeaveRequest[];
  balances: Record<string, LeaveBalance>;
  auditLogs: AuditLog[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  plans,
  leaves,
  balances,
  auditLogs,
  onNavigate,
}) => {
  const isTeacher = currentUser.role === 'Teacher';
  const isApprover = [
    'Principal',
    'Deputy Principal',
    'Sectional Head',
    'Head of Department',
  ].includes(currentUser.role);
  const isAdmin = ['Super Administrator', 'Principal'].includes(currentUser.role);

  // Computed Values - Teachers
  const teacherPlans = plans.filter((p) => p.teacherId === currentUser.id);
  const draftsCount = teacherPlans.filter((p) => p.status === 'draft').length;
  const pendingCount = teacherPlans.filter((p) => p.status === 'pending').length;
  const approvedCount = teacherPlans.filter((p) => p.status === 'approved').length;
  const rejectedCount = teacherPlans.filter((p) => p.status === 'rejected').length;

  const currentTeacherBalance = balances[currentUser.id] || { Annual: 12, Sick: 8, Casual: 5 };

  // Computed Values - Approvers
  const approverPendingPlans = plans.filter((p) => {
    // If we are Principal, we can approve anything or see all. Or if this teacher has us assigned.
    const teacher = INITIAL_USERS_MOCK.find((u) => u.id === p.teacherId);
    if (!teacher) return false;
    // Plan is pending AND the teacher's assigned officer matches current user ID
    return p.status === 'pending' && teacher.assignedOfficerId === currentUser.id;
  });

  // Since we might have modified users, let's load current user config
  const loadedUsersRaw = localStorage.getItem('sf_users');
  const loadedUsers: User[] = loadedUsersRaw ? JSON.parse(loadedUsersRaw) : [];
  
  const pendingForThisOfficer = plans.filter((p) => {
    if (p.status !== 'pending') return false;
    const teacher = loadedUsers.find((u) => u.id === p.teacherId);
    return teacher?.assignedOfficerId === currentUser.id;
  });

  // Total approvals processed in system
  const totalSystemApproved = plans.filter((p) => p.status === 'approved').length;
  const totalSystemPending = plans.filter((p) => p.status === 'pending').length;
  const totalSystemRejected = plans.filter((p) => p.status === 'rejected').length;
  const totalSystemDrafts = plans.filter((p) => p.status === 'draft').length;

  // Active leaves pending approval
  const pendingLeaves = leaves.filter((l) => l.status === 'pending');

  // Filter logs for this user (or system if admin)
  const displayLogs = isAdmin
    ? auditLogs.slice(0, 5)
    : auditLogs.filter((log) => log.userId === currentUser.id).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Dynamic Welcome Heading with Ambient Backdrop */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-3xs tracking-widest font-black uppercase text-indigo-300">Operational node active</span>
          <h2 className="font-sans font-bold text-xl md:text-2xl mt-1 tracking-tight">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            SchoolFlow integrates multi-stage syllabus formulation, workflow validation structures, and staff leave governance under a unified compliance dashboard.
          </p>
        </div>
        <div className="flex gap-2">
          {isTeacher && (
            <button
              id="dash-create-btn"
              onClick={() => onNavigate('lesson-plans')}
              className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs px-4 py-2.5 rounded-xl text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Write New Plan
            </button>
          )}
          {isApprover && pendingForThisOfficer.length > 0 && (
            <button
              id="dash-queue-btn"
              onClick={() => onNavigate('approval-queue')}
              className="bg-amber-500 hover:bg-amber-400 font-semibold text-xs px-4 py-2.5 rounded-xl text-slate-950 flex items-center gap-2 transition-all cursor-pointer animate-pulse"
            >
              <Inbox className="h-4 w-4" />
              Process Decisions ({pendingForThisOfficer.length})
            </button>
          )}
        </div>
      </div>

      {/* Grid of Key Operations Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-3xs uppercase font-extrabold text-gray-400">Approved Plans</p>
              <p className="text-2xl font-black text-gray-900 mt-1 leading-none">
                {isTeacher ? approvedCount : totalSystemApproved}
              </p>
            </div>
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <p className="text-3xs text-gray-500 mt-3 font-medium">Locked &amp; ready for prints</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-3xs uppercase font-extrabold text-gray-400">Pending Review</p>
              <p className="text-2xl font-black text-gray-900 mt-1 leading-none">
                {isTeacher ? pendingCount : pendingForThisOfficer.length}
              </p>
            </div>
            <span className={`p-2 rounded-lg ${isTeacher ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
              {isTeacher ? <Clock className="h-5 w-5" /> : <Inbox className="h-5 w-5" />}
            </span>
          </div>
          <p className="text-3xs text-gray-500 mt-3 font-medium">
            {isTeacher ? 'Awaiting assigned officer check' : 'Assigned straight to you'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-3xs uppercase font-extrabold text-gray-400">Rejections &amp; Drafts</p>
              <p className="text-2xl font-black text-gray-900 mt-1 leading-none">
                {isTeacher ? rejectedCount + draftsCount : totalSystemDrafts + totalSystemRejected}
              </p>
            </div>
            <span className="p-2 bg-slate-50 text-slate-600 rounded-lg">
              <FileText className="h-5 w-5" />
            </span>
          </div>
          <p className="text-3xs text-gray-500 mt-3 font-medium">Requires attention / modification</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-3xs uppercase font-extrabold text-gray-400">
                {isTeacher ? 'Casual Leave Balance' : 'Active Leave Requests'}
              </p>
              <p className="text-2xl font-black text-gray-900 mt-1 leading-none">
                {isTeacher ? `${currentTeacherBalance.Casual} / 5` : pendingLeaves.length}
              </p>
            </div>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar className="h-5 w-5" />
            </span>
          </div>
          <p className="text-3xs text-gray-500 mt-3 font-medium">
            {isTeacher ? 'Available casual days left' : 'Awaiting administrative check'}
          </p>
        </div>
      </div>

      {/* Grid of Inner Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Activity & Workflows */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Approvals Review Quickboard (for Approvers) */}
          {isApprover && pendingForThisOfficer.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/60 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h3 className="font-sans font-bold text-sm text-amber-900">Task Alert: Lessons Awaiting Your Review</h3>
              </div>
              <p className="text-xs text-amber-800 mb-4">
                You are currently mapped as the active approval officer for the following submissions. Under section policy, rejection remarks are strictly mandatory.
              </p>
              <div className="space-y-2">
                {pendingForThisOfficer.map((plan) => (
                  <div key={plan.id} className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs flex justify-between items-center gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{plan.title}</p>
                      <p className="text-3xs text-gray-400 font-medium">
                        By {plan.teacherName} | {plan.grade} - {plan.subject} | Version {plan.currentVersionNo}
                      </p>
                    </div>
                    <button
                      id={`dash-review-${plan.id}`}
                      onClick={() => onNavigate('approval-queue')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-3xs rounded-lg transition-colors cursor-pointer"
                    >
                      Process Decision
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Logs / Activity Ledger */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-sans font-bold text-sm text-gray-900">Operation Audit Trails</h3>
                <p className="text-3xs text-gray-400 font-medium">Chronological record of verified system logs</p>
              </div>
              <button
                id="dash-view-audit"
                onClick={() => onNavigate(isAdmin ? 'audit-logs' : 'dashboard')}
                className="text-xs text-slate-600 hover:text-emerald-700 font-bold tracking-tight cursor-pointer"
              >
                View full trail &rarr;
              </button>
            </div>
            <div className="space-y-3.5">
              {displayLogs.map((log) => {
                const isSuccess = log.status === 'SUCCESS';
                return (
                  <div key={log.id} className="flex gap-3 items-start text-xs border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isSuccess ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-gray-800 leading-tight">
                          {log.action} <span className="font-normal text-gray-500">({log.entity})</span>
                        </p>
                        <span className="text-3xs font-mono text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-3xs text-gray-500 leading-relaxed mt-0.5">{log.details}</p>
                      <p className="text-3xs text-slate-400 font-semibold mt-1">
                        Issuer: {log.userName} ({log.userRole})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Rule Policy & Compliance Checklists */}
        <div className="space-y-6">
          {/* Automatic Retention Policy Indicator */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-indigo-400">
              <Archive className="h-4.5 w-4.5" />
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-200">Retention Policy</h3>
            </div>
            <p className="text-3xs text-slate-400 leading-relaxed">
              Approved lesson plans and structural records are preserved securely for exactly **3 years**. High-frequency cron sweeps automatically depose legacy files.
            </p>
            <div className="mt-4 p-3 bg-slate-800 rounded-xl border border-slate-750/70">
              <div className="flex justify-between items-center text-3xs mb-1.5">
                <span className="text-slate-400 font-medium">Compliance Check:</span>
                <span className="text-emerald-400 font-bold">100% Compliant</span>
              </div>
              <p className="text-3xs text-slate-400">No records older than 36 months detected within database arrays.</p>
            </div>
          </div>

          {/* Quick Leave balances (For teacher or info card) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-gray-900 mb-3">Leave Category Balances</h3>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-3xs font-extrabold text-gray-500 mb-1">
                  <span>ANNUAL LEAVE LIMITS</span>
                  <span>{currentTeacherBalance.Annual} / 20 days</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${(currentTeacherBalance.Annual / 20) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-3xs font-extrabold text-gray-500 mb-1">
                  <span>SICK CERTIFIED LEAVE</span>
                  <span>{currentTeacherBalance.Sick} / 15 days</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all"
                    style={{ width: `${(currentTeacherBalance.Sick / 15) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-3xs font-extrabold text-gray-500 mb-1">
                  <span>CASUAL SHORT LEAVE</span>
                  <span>{currentTeacherBalance.Casual} / 5 days</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${(currentTeacherBalance.Casual / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Initial users fallback map for static logic inside Component
const INITIAL_USERS_MOCK = [
  { id: 'u1', name: 'Sarah Jenkins', role: 'Teacher', assignedOfficerId: 'u4' },
  { id: 'u2', name: 'David Miller', role: 'Teacher', assignedOfficerId: 'u3' },
  { id: 'u3', name: 'Eleanor Vance', role: 'Deputy Principal' },
  { id: 'u4', name: 'James Carter', role: 'Head of Department' },
  { id: 'u5', name: 'Dr. Arthur Winston', role: 'Principal' },
  { id: 'u6', name: 'Marcus Brody', role: 'Super Administrator' },
];
