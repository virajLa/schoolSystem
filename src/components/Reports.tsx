import React, { useState } from 'react';
import { LessonPlan, LeaveRequest, User } from '../types';
import { Filter, Sliders, Printer, FileDown, TrendingUp, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

interface ReportsProps {
  plans: LessonPlan[];
  leaves: LeaveRequest[];
  allUsers: User[];
  onTriggerPrint: (plansList: LessonPlan[]) => void;
}

export const Reports: React.FC<ReportsProps> = ({ plans, leaves, allUsers, onTriggerPrint }) => {
  // Report Types: lesson-plans, leave-requests
  const [reportType, setReportType] = useState<'lessons' | 'leaves'>('lessons');

  // Filters State
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const teachers = allUsers.filter((u) => u.role === 'Teacher');

  // Filter lessons
  const filteredPlans = plans.filter((p) => {
    const matchesTeacher = filterTeacher === 'all' || p.teacherId === filterTeacher;
    const matchesGrade = filterGrade === 'all' || p.grade === filterGrade;
    const matchesClass = filterClass === 'all' || p.classSection === filterClass;
    const matchesSubject = filterSubject === 'all' || p.subject === filterSubject;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesTeacher && matchesGrade && matchesClass && matchesSubject && matchesStatus;
  });

  // Filter leaves
  const filteredLeaves = leaves.filter((l) => {
    const matchesTeacher = filterTeacher === 'all' || l.teacherId === filterTeacher;
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchesTeacher && matchesStatus;
  });

  const exportCSV = () => {
    let headers = '';
    let rows = '';

    if (reportType === 'lessons') {
      headers = 'Id,Title,Instructor,Subject,Grade,Roster,Date,Status,Version\n';
      rows = filteredPlans
        .map((p) => `"${p.id}","${p.title}","${p.teacherName}","${p.subject}","${p.grade}","${p.classSection}","${p.date}","${p.status}","${p.currentVersionNo}"`)
        .join('\n');
    } else {
      headers = 'Id,Instructor,Department,Type,Start,End,Reason,Status\n';
      rows = filteredLeaves
        .map((l) => `"${l.id}","${l.teacherName}","${l.department}","${l.type}","${l.startDate}","${l.endDate}","${l.reason}","${l.status}"`)
        .join('\n');
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
    const encodeUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodeUri);
    link.setAttribute('download', `${reportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider">Reports &amp; Analytics Logs</h2>
        <p className="text-3xs text-gray-500 font-medium">Configure deep custom filters, download spreadsheet audits, or issue unified print copies.</p>
      </div>

      {/* Selector and export actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            id="report-btn-lessons"
            onClick={() => {
              setReportType('lessons');
              setFilterStatus('all');
            }}
            className={`px-4 py-2 text-3xs font-black uppercase rounded-lg select-none cursor-pointer transition-colors ${
              reportType === 'lessons'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            Lessons Reporting List
          </button>
          <button
            id="report-btn-leaves"
            onClick={() => {
              setReportType('leaves');
              setFilterStatus('all');
            }}
            className={`px-4 py-2 text-3xs font-black uppercase rounded-lg select-none cursor-pointer transition-colors ${
              reportType === 'leaves'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            Absence Requests Ledger
          </button>
        </div>

        <div className="flex gap-2.5">
          <button
            id="btn-export-csv"
            onClick={exportCSV}
            className="flex items-center gap-1.5 p-2 bg-white hover:bg-slate-50 border border-gray-200 text-slate-800 font-bold text-3xs rounded-lg shadow-3xs cursor-pointer transition-colors"
          >
            <FileDown className="h-4 w-4" />
            Export Spreadsheet
          </button>
          {reportType === 'lessons' && (
            <button
              id="btn-print-bulk"
              onClick={() => onTriggerPrint(filteredPlans)}
              className="flex items-center gap-1.5 p-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs rounded-lg shadow-2xs cursor-pointer transition-colors"
            >
              <Printer className="h-4 w-4" />
              Unified Printing Pack
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Box */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
        <h3 className="font-sans font-bold text-xs text-gray-800 flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
          <Filter className="h-4.5 w-4.5 text-emerald-600" />
          Filter Parameters
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Teacher</label>
            <select
              value={filterTeacher}
              id="filter-teacher"
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
            >
              <option value="all">All Teachers</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {reportType === 'lessons' && (
            <>
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Grade</label>
                <select
                  value={filterGrade}
                  id="filter-grade"
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
                >
                  <option value="all">All Grades</option>
                  {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Class/Roster</label>
                <select
                  value={filterClass}
                  id="filter-class"
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
                >
                  <option value="all">All Classes</option>
                  {['Class A', 'Class B', 'Class C', 'Class D'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Subject</label>
                <select
                  value={filterSubject}
                  id="filter-subject"
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
                >
                  <option value="all">All Subjects</option>
                  {['Biology', 'Mathematics', 'Physics', 'Science'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Status</label>
            <select
              value={filterStatus}
              id="filter-status"
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content table matching report selection */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
        {reportType === 'lessons' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold text-3xs uppercase tracking-widest border-b border-gray-150">
                  <th className="p-3.5 pl-6">Core Title</th>
                  <th className="p-3.5">Instructor</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Grade</th>
                  <th className="p-3.5">Class</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      No matching lesson logs found under filtered configurations.
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => {
                    const isApproved = plan.status === 'approved';
                    const isPending = plan.status === 'pending';
                    const isRejected = plan.status === 'rejected';

                    let statusBadge = (
                      <span className="bg-slate-100 text-slate-700 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Draft
                      </span>
                    );
                    if (isApproved) {
                      statusBadge = (
                        <span className="bg-emerald-100 text-emerald-800 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Approved
                        </span>
                      );
                    } else if (isPending) {
                      statusBadge = (
                        <span className="bg-amber-100 text-amber-800 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Pending
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
                      <tr key={plan.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 pl-6 font-bold text-slate-900 leading-snug">{plan.title}</td>
                        <td className="p-3.5 text-slate-600 font-medium">{plan.teacherName}</td>
                        <td className="p-3.5 text-slate-600 font-medium">{plan.subject}</td>
                        <td className="p-3.5 text-slate-500 font-bold">{plan.grade}</td>
                        <td className="p-3.5 text-slate-500 font-bold">{plan.classSection}</td>
                        <td className="p-3.5 text-slate-500 font-mono font-bold">{plan.date}</td>
                        <td className="p-3.5">{statusBadge}</td>
                        <td className="p-3.5 font-bold font-mono text-slate-500">v{plan.currentVersionNo}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold text-3xs uppercase tracking-widest border-b border-gray-150">
                  <th className="p-3.5 pl-6">Instructor Name</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Absence Type</th>
                  <th className="p-3.5">Start Date</th>
                  <th className="p-3.5">End Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No matching absence requests ledger found.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((lev) => {
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
                      <tr key={lev.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 pl-6 font-bold text-slate-900 leading-snug">{lev.teacherName}</td>
                        <td className="p-3.5 text-slate-600 font-medium">{lev.department}</td>
                        <td className="p-3.5 font-bold text-emerald-800">{lev.type} Leave</td>
                        <td className="p-3.5 text-slate-500 font-mono font-bold">{lev.startDate}</td>
                        <td className="p-3.5 text-slate-500 font-mono font-bold">{lev.endDate}</td>
                        <td className="p-3.5">{statusBadge}</td>
                        <td className="p-3.5 text-slate-500 italic max-w-xs truncate">{lev.reason}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
