import React, { useState } from 'react';
import { User, LeaveRequest, LeaveType, LeaveBalance, LeaveStatus } from '../types';
import {
  Calendar,
  Upload,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Briefcase,
  History,
  TrendingDown,
  ChevronRight,
  Info,
} from 'lucide-react';

interface LeaveRequestProps {
  currentUser: User;
  leaves: LeaveRequest[];
  balances: Record<string, LeaveBalance>;
  onSubmitLeave: (req: LeaveRequest) => void;
  onApproveLeave: (leaveId: string, officer: User, remarks: string) => void;
  onRejectLeave: (leaveId: string, officer: User, remarks: string) => void;
}

export const LeaveRequestTab: React.FC<LeaveRequestProps> = ({
  currentUser,
  leaves,
  balances,
  onSubmitLeave,
  onApproveLeave,
  onRejectLeave,
}) => {
  const isTeacher = currentUser.role === 'Teacher';
  const isAdmin = ['Super Administrator', 'Principal', 'Deputy Principal'].includes(currentUser.role);

  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  // Computed values
  const currentBalance = balances[currentUser.id] || { Annual: 14, Sick: 8, Casual: 5 };
  const userLeaves = leaves.filter((l) => l.teacherId === currentUser.id);
  const pendingAdministrativeLeaves = leaves.filter((l) => l.status === 'pending');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachment(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    if (!startDate || !endDate || !reason.trim()) {
      setErrorText('Please provide start/end dates and describe specific reasons.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setErrorText('The selected end date cannot fall prior to your selected start date.');
      return;
    }

    // Days calculation (inclusive)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Balance Limits check
    if (leaveType === 'Annual' && requestedDays > currentBalance.Annual) {
      setErrorText(`Your requested Annual Leave length (${requestedDays} days) exceeds your remaining Annual Balance (${currentBalance.Annual} days).`);
      return;
    }
    if (leaveType === 'Sick' && requestedDays > currentBalance.Sick) {
      setErrorText(`Your requested Sick Leave length (${requestedDays} days) exceeds your remaining Sick Balance (${currentBalance.Sick} days).`);
      return;
    }
    if (leaveType === 'Casual' && requestedDays > currentBalance.Casual) {
      setErrorText(`Your requested Casual Leave length (${requestedDays} days) exceeds your remaining Casual Balance (${currentBalance.Casual} days).`);
      return;
    }

    const newReq: LeaveRequest = {
      id: `lv-${Date.now()}`,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      department: currentUser.department,
      type: leaveType,
      startDate,
      endDate,
      reason,
      status: 'pending',
      attachmentName: attachment || undefined,
      createdAt: new Date().toISOString(),
    };

    onSubmitLeave(newReq);
    setSuccessText(`Your leave request of ${requestedDays} days has been logged and routed to administration.`);
    setStartDate('');
    setEndDate('');
    setReason('');
    setAttachment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider">Leave Operations Center</h2>
          <p className="text-3xs text-gray-500 font-medium">Log upcoming leaves, upload credentials, and check administrative balances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* balance cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200/85 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-3xs font-extrabold text-gray-400 uppercase tracking-widest block">Annual Allotment Left</span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">{currentBalance.Annual} / 20 days</span>
            </div>
            <span className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600"><Briefcase className="h-5 w-5" /></span>
          </div>
          <div className="bg-white border border-gray-200/85 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-3xs font-extrabold text-gray-400 uppercase tracking-widest block">Sick Certified Left</span>
              <span className="text-xl font-bold font-mono text-sky-700 mt-1 block">{currentBalance.Sick} / 15 days</span>
            </div>
            <span className="p-2.5 bg-sky-50 rounded-lg text-sky-600"><Info className="h-5 w-5" /></span>
          </div>
          <div className="bg-white border border-gray-200/85 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-3xs font-extrabold text-gray-400 uppercase tracking-widest block">Casual Days Left</span>
              <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">{currentBalance.Casual} / 5 days</span>
            </div>
            <span className="p-2.5 bg-amber-50 rounded-lg text-amber-600"><Clock className="h-5 w-5" /></span>
          </div>
        </div>

        {/* Left Form: submit leave (Only for Teachers) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/85 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5 mb-4">Request Absence</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Absence Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  {['Annual', 'Sick', 'Casual', 'Professional Development', 'Emergency'].map(l => (
                    <option key={l} value={l}>{l} Leave</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Reason Description</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Outline necessary cover details or medical necessity..."
                  rows={2.5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                />
              </div>

              {/* Usability Guidelines: Manual + Drag-and-drop file upload */}
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Supporting attachment</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative cursor-pointer group"
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                  />
                  <Upload className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 mx-auto mb-1.5 transition-colors" />
                  <p className="text-3xs text-gray-500">
                    {attachment ? (
                      <span className="text-emerald-700 font-extrabold flex items-center justify-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {attachment}
                      </span>
                    ) : (
                      'Drag file here or click to select.'
                    )}
                  </p>
                </div>
              </div>

              {errorText && (
                <div className="text-rose-600 text-3xs font-semibold leading-tight bg-rose-50 border border-rose-100 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="h-4.5 w-4.5" />
                  {errorText}
                </div>
              )}

              {successText && (
                <div className="text-emerald-800 text-3xs font-semibold leading-tight bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
                  {successText}
                </div>
              )}

              <button
                type="submit"
                id="btn-submit-leave"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer text-center"
              >
                Log Absence Request
              </button>
            </form>
          </div>
        </div>

        {/* Right side check balances list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incoming admin panel */}
          {isAdmin && pendingAdministrativeLeaves.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <span className="text-3xs font-black uppercase tracking-wider text-amber-700 block mb-1">Administrative Duty Queue</span>
              <h3 className="font-sans font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4">Absences Requiring Action</h3>
              <div className="space-y-4">
                {pendingAdministrativeLeaves.map((lev) => {
                  return (
                    <div key={lev.id} className="p-4 bg-slate-50/60 hover:bg-slate-50 border border-gray-200/80 rounded-xl space-y-3 transition-all">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <span className="text-3xs font-extrabold uppercase bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded mr-1.5">
                            {lev.type} Leave
                          </span>
                          <h4 className="font-sans font-bold text-gray-900 text-xs mt-1.5">{lev.teacherName} ({lev.department})</h4>
                        </div>
                        <span className="text-3xs text-gray-400 font-mono font-bold tracking-tight">
                          {lev.startDate} &bull; {lev.endDate}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold italic">Remarks: &ldquo;{lev.reason}&rdquo;</p>
                      
                      {lev.attachmentName && (
                        <p className="text-3xs text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded inline-block">
                          <Paperclip className="h-3 w-3" />
                          Attachment: {lev.attachmentName}
                        </p>
                      )}

                      <div className="pt-2 border-t border-gray-200/60 flex justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Audit remarks or cover plan notes..."
                          value={remarks[lev.id] || ''}
                          id={`remarks-input-leave-${lev.id}`}
                          onChange={(e) => setRemarks({ ...remarks, [lev.id]: e.target.value })}
                          className="flex-1 bg-white border border-gray-200 px-2 py-1 rounded text-3xs outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <div className="flex gap-1.5">
                          <button
                            id={`btn-reject-leave-${lev.id}`}
                            onClick={() => onRejectLeave(lev.id, currentUser, remarks[lev.id] || '')}
                            className="text-rose-600 hover:bg-rose-50 border border-rose-100 px-2.5 py-1 rounded text-3xs font-bold uppercase transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            id={`btn-approve-leave-${lev.id}`}
                            onClick={() => onApproveLeave(lev.id, currentUser, remarks[lev.id] || '')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-3xs font-bold uppercase transition-colors"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historical Logs List */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/85">
            <h3 className="font-sans font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4">Historical Absences Log</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(isTeacher ? userLeaves : leaves).length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No historical records logged currently.</p>
              ) : (
                (isTeacher ? userLeaves : leaves).map((lev) => {
                  const isApproved = lev.status === 'approved';
                  const isPending = lev.status === 'pending';
                  const isRejected = lev.status === 'rejected';

                  let statusBadge = (
                    <span className="bg-slate-100 text-slate-700 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Pending
                    </span>
                  );
                  if (isApproved) {
                    statusBadge = (
                      <span className="bg-emerald-100 text-emerald-800 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Approved
                      </span>
                    );
                  } else if (isRejected) {
                    statusBadge = (
                      <span className="bg-rose-100 text-rose-800 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Rejected
                      </span>
                    );
                  }

                  return (
                    <div key={lev.id} className="p-3 bg-white border border-gray-150 rounded-xl space-y-2 flex flex-col justify-between hover:shadow-2xs transition-shadow">
                      <div className="flex justify-between items-center text-3xs flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{lev.teacherName} &bull; {lev.type} Leave</span>
                        </div>
                        {statusBadge}
                      </div>
                      <p className="text-3xs text-gray-500 font-mono tracking-tight leading-none pt-1">Span: {lev.startDate} &mdash; {lev.endDate}</p>
                      <p className="text-xs text-gray-600 leading-snug font-medium">&ldquo;{lev.reason}&rdquo;</p>
                      
                      {lev.remarks && (
                        <div className="bg-slate-50 border border-slate-100/50 p-2 rounded-lg text-3xs text-gray-700">
                          <strong>Admin Response:</strong> &ldquo;{lev.remarks}&rdquo; by {lev.approvedByName || 'System'}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
