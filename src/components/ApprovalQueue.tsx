import React, { useState } from 'react';
import { User, LessonPlan, LessonPlanVersion } from '../types';
import {
  Inbox,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Printer,
  ChevronDown,
  Layers,
  FileText,
  UserCheck,
} from 'lucide-react';

interface ApprovalQueueProps {
  currentUser: User;
  plans: LessonPlan[];
  onApprove: (planId: string, versionNo: string, officer: User, remarks: string) => void;
  onReject: (planId: string, versionNo: string, officer: User, remarks: string) => void;
  onPrintPreview: (plan: LessonPlan, versionNo?: string) => void;
  allUsers: User[];
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({
  currentUser,
  plans,
  onApprove,
  onReject,
  onPrintPreview,
  allUsers,
}) => {
  // Find which teachers have current logged-in officer mapped as their supervisor
  const pendingPlans = plans.filter((plan) => {
    if (plan.status !== 'pending') return false;
    
    // Look up creator teacher's mapped officers
    const teacher = allUsers.find(u => u.id === plan.teacherId);
    return teacher?.assignedOfficerId === currentUser.id;
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    pendingPlans.length > 0 ? pendingPlans[0].id : null
  );
  const [remarks, setRemarks] = useState('');
  const [errorText, setErrorText] = useState('');

  // Find active plan details
  const activePlan = plans.find((p) => p.id === selectedPlanId);
  const latestVersion = activePlan?.versions[activePlan.versions.length - 1];

  // If a plan is selected but is not pending or not in list due to dynamic updates, reset
  const hasActiveQueue = pendingPlans.length > 0;

  const handleApproveAction = () => {
    if (!activePlan || !latestVersion) return;
    setErrorText('');
    onApprove(activePlan.id, latestVersion.versionNo, currentUser, remarks);
    setRemarks('');
    // Auto shift selection to next pending
    const remaining = pendingPlans.filter((p) => p.id !== activePlan.id);
    setSelectedPlanId(remaining.length > 0 ? remaining[0].id : null);
  };

  const handleRejectAction = () => {
    if (!activePlan || !latestVersion) return;
    // CRITICAL MANDATE RESTRICTION CHECK:
    // "Approval remarks are mandatory when rejecting a lesson plan."
    if (!remarks.trim()) {
      setErrorText('You are strictly required to write descriptive rejection remarks citing necessary modifications before reject action.');
      return;
    }
    setErrorText('');
    onReject(activePlan.id, latestVersion.versionNo, currentUser, remarks);
    setRemarks('');
    // Auto shift selection to next pending
    const remaining = pendingPlans.filter((p) => p.id !== activePlan.id);
    setSelectedPlanId(remaining.length > 0 ? remaining[0].id : null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider">Approval Ledger Matrix</h2>
        <p className="text-3xs text-gray-500 font-medium">Verify structural lesson competencies and sign off on completed academic logs.</p>
      </div>

      {!hasActiveQueue ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200/80">
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle className="h-6 w-6" id="queue-clear-icon" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Approval Desk is Completely Clear</p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            All submitted lesson structures have been processed. Active routing updates instantly when other teachers submit reviews.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Active Pending Items Listing */}
          <div className="space-y-3 lg:col-span-1">
            <span className="text-3xs font-black uppercase tracking-wider text-gray-400 block px-1">Desk Incoming ({pendingPlans.length})</span>
            <div className="space-y-2">
              {pendingPlans.map((plan) => {
                const planLatest = plan.versions[plan.versions.length - 1];
                const isSelected = plan.id === selectedPlanId;
                return (
                  <button
                    key={plan.id}
                    id={`queue-item-${plan.id}`}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setErrorText('');
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden select-none cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600/5 hover:bg-emerald-600/10 border-emerald-500 shadow-2xs'
                        : 'bg-white hover:bg-gray-50 border-gray-200/85'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-3xs font-black text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded tracking-wide uppercase">
                          {plan.grade} &bull; v{plan.currentVersionNo}
                        </span>
                        <span className="text-3xs text-gray-400 font-bold font-mono">
                          {plan.date}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-gray-900 text-xs truncate mt-1">
                        {plan.title}
                      </h4>
                      <p className="text-3xs text-gray-500 font-semibold">
                        Instructor: <span className="text-slate-700 font-bold">{plan.teacherName}</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Active Review Sandbox */}
          <div className="lg:col-span-2 space-y-6">
            {activePlan && latestVersion ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 bg-slate-50 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <span className="text-3xs font-black text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded tracking-wide uppercase">
                      Incoming Validation Frame
                    </span>
                    <h3 className="font-sans font-black text-gray-800 text-sm mt-1">{activePlan.title}</h3>
                    <p className="text-3xs text-gray-400 mt-1 font-semibold">
                      Author: {activePlan.teacherName} ({activePlan.grade}) | Target Date: {activePlan.date}
                    </p>
                  </div>
                  <button
                    id="queue-print-preview"
                    onClick={() => onPrintPreview(activePlan, latestVersion.versionNo)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-bold text-3xs rounded-lg shadow-3xs cursor-pointer transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Validation Draft
                  </button>
                </div>

                {/* Body details */}
                <div className="p-6 space-y-6 max-h-[30rem] overflow-y-auto">
                  {/* Daily Notes Panel */}
                  <div className="space-y-4">
                    <h4 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-gray-100 pb-1.5">1. Daily Learning Objectives</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50/60 rounded-xl p-3.5 border border-dashed border-gray-200">
                        <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide">Competency Framework</span>
                        <p className="text-xs text-gray-800 font-medium mt-1 leading-relaxed">
                          {latestVersion.dailyNotes.competency || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-slate-50/60 rounded-xl p-3.5 border border-dashed border-gray-200">
                        <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide">Performance Level Index</span>
                        <p className="text-xs text-gray-800 font-medium mt-1 leading-relaxed">
                          {latestVersion.dailyNotes.competencyLevel || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50/60 rounded-xl p-3.5 border border-dashed border-gray-200">
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide">Methodology Outline ({latestVersion.dailyNotes.methodology})</span>
                      <p className="text-xs text-gray-800 font-medium mt-1 leading-relaxed">
                        {latestVersion.dailyNotes.aims || 'N/A'}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-3xs bg-white text-xs">
                      <div className="bg-slate-100/80 px-3 py-2 font-bold text-slate-700 border-b border-gray-200 flex justify-between">
                        <span>Class Transition Steps</span>
                        <span className="font-mono text-3xs text-slate-500">Run Limit: {latestVersion.dailyNotes.approachTimeMinutes} mins</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {latestVersion.dailyNotes.proceduralActivities.map((act) => (
                          <div key={act.seq} className="p-3 bg-white hover:bg-slate-50/40 flex gap-4 text-xs">
                            <span className="font-mono text-gray-400 font-bold">{act.seq}.</span>
                            <div className="flex-1">
                              <span className="text-3xs font-extrabold uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mr-2">
                                {act.entity}
                              </span>
                              <span className="text-3xs text-slate-400 font-mono font-bold">({act.duration})</span>
                              <p className="text-gray-700 mt-1 font-medium">{act.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Weekly details if filled */}
                  {latestVersion.weeklyNotes.theme && (
                    <div className="space-y-3.5 pt-2">
                      <h4 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-gray-100 pb-1.5">2. Weekly Curriculum Block</h4>
                      <div className="bg-emerald-50/25 p-4 rounded-xl border border-emerald-100 space-y-2.5">
                        <div className="flex justify-between flex-wrap gap-2 text-3xs font-extrabold text-emerald-800">
                          <span>THEME: {latestVersion.weeklyNotes.theme}</span>
                          <span>WEEK START: {latestVersion.weeklyNotes.weekStart}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          <strong>Objectives:</strong> {latestVersion.weeklyNotes.objectives}
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          <strong>Materials Loaded:</strong> {latestVersion.weeklyNotes.materials}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Unit details if filled */}
                  {latestVersion.unitNotes.unitTitle && (
                    <div className="space-y-3.5 pt-2">
                      <h4 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-gray-100 pb-1.5">3. Unit Scope &amp; Sequence</h4>
                      <div className="bg-indigo-50/25 p-4 rounded-xl border border-indigo-100 space-y-2 text-xs font-semibold text-indigo-950">
                        <p className="font-bold">UNIT: {latestVersion.unitNotes.unitTitle}</p>
                        <p className="text-3xs text-indigo-650 leading-relaxed mt-1">
                          <strong>Unit Goals:</strong> {latestVersion.unitNotes.unitObjectives}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Validation and remarks input form panel */}
                <div className="p-6 border-t border-gray-100 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
                      <span>Remarks / Validation Notes</span>
                      <span className="text-rose-600 font-bold">* Required on rejection actions</span>
                    </label>
                    <textarea
                      id="queue-input-remarks"
                      rows={2.5}
                      value={remarks}
                      onChange={(e) => {
                        setRemarks(e.target.value);
                        setErrorText('');
                      }}
                      placeholder="Comment on aims, procedural timeline adjustments, cellular risk safety, etc..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                    {errorText && (
                      <div className="mt-2 text-rose-600 text-3xs font-medium flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4" />
                        {errorText}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-1 border-t border-gray-100 bg-slate-50">
                    <button
                      id="btn-queue-reject"
                      onClick={handleRejectAction}
                      className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-thin border-rose-100 text-3xs font-extrabold uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                      Reject Plan
                    </button>
                    <button
                      id="btn-queue-approve"
                      onClick={handleApproveAction}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-3xs font-extrabold uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      <CheckCircle className="h-4.5 w-4.5" />
                      Deem Approved
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
