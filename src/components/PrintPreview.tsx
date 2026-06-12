import React from 'react';
import { LessonPlan, LessonPlanVersion, User } from '../types';
import { X, Printer, ShieldCheck, FileText } from 'lucide-react';

interface PrintPreviewProps {
  plan: LessonPlan;
  versionNo?: string; // Optional: specify version, defaults to latest
  onClose: () => void;
  allUsers: User[];
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  plan,
  versionNo,
  onClose,
  allUsers,
}) => {
  // Determine version to map
  const activeVersion = versionNo
    ? plan.versions.find((v) => v.versionNo === versionNo)
    : plan.versions[plan.versions.length - 1];

  if (!activeVersion) return null;

  const isApproved = activeVersion.status === 'approved';

  // Let's find who is the mapped approval officer for the teacher
  const teacherObj = allUsers.find((u) => u.id === plan.teacherId);
  const officerObj = allUsers.find((u) => u.id === teacherObj?.assignedOfficerId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col md:h-[90vh]">
        
        {/* Modal Controls Banner (Hidden on actual print!) */}
        <div className="p-5 border-b border-gray-150 bg-slate-900 text-slate-100 flex justify-between items-center print:hidden flex-shrink-0">
          <div>
            <span className="text-3xs uppercase font-extrabold tracking-wider text-slate-400">Print Formatter Engine</span>
            <h3 className="font-sans font-bold text-sm">
              Document Preview &bull; {isApproved ? 'Approved & Locked' : 'Pre-Approval Mock Draft'}
            </h3>
          </div>
          <div className="flex gap-2.5">
            <button
              id="print-trigger-action"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs px-4 py-2 rounded-lg text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              Print Document
            </button>
            <button
              id="print-close-modal"
              onClick={onClose}
              className="p-1 px-2.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Close Print Panel
            </button>
          </div>
        </div>

        {/* Printable Document Sheet Canvas */}
        <div className="p-8 md:p-12 overflow-y-auto bg-white flex-1 text-slate-900 leading-normal printable-area">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .printable-area, .printable-area * {
                visibility: visible;
              }
              .printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 0 !important;
                margin: 0 !important;
                border: 0 !important;
                font-size: 11pt !important;
              }
              .print\\:hidden {
                display: none !important;
              }
            }
          `}</style>

          {/* Institutional Crest & Document Header */}
          <div className="border-b-4 border-slate-900 pb-5 text-center space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight uppercase">SchoolFlow Academic Network</h1>
            <p className="text-xs uppercase font-extrabold tracking-widest text-slate-500">Official Lesson Plan Portfolio &bull; Standard syllabus schema</p>
            <div className="inline-block mt-2 bg-slate-100 border border-slate-200 text-3xs font-black uppercase px-3 py-1 rounded">
              Status: {isApproved ? 'APPROVED & VERIFIED' : 'PENDING SIGN-OFF'} (v{activeVersion.versionNo})
            </div>
          </div>

          {/* Master Roster Assignments Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-gray-200 text-xs">
            <div>
              <p className="text-3xs uppercase font-black text-slate-400">Classroom Instructor</p>
              <p className="font-sans font-bold text-slate-800">{plan.teacherName}</p>
              <p className="text-3xs text-slate-400 font-medium">Science Department</p>
            </div>
            <div>
              <p className="text-3xs uppercase font-black text-slate-400">Subject / Category</p>
              <p className="font-sans font-bold text-slate-800">{plan.subject}</p>
            </div>
            <div>
              <p className="text-3xs uppercase font-black text-slate-400">Target Grade Level</p>
              <p className="font-sans font-bold text-slate-800">{plan.grade} &bull; {plan.classSection}</p>
            </div>
            <div>
              <p className="text-3xs uppercase font-black text-slate-400">Date Mapped</p>
              <p className="font-sans font-bold text-slate-800">{plan.date}</p>
            </div>
          </div>

          <div className="py-6 space-y-6">
            <div>
              <p className="text-3xs uppercase font-black text-slate-400">Main Lesson Title</p>
              <h2 className="text-lg font-black text-slate-900 leading-snug mt-1">{activeVersion.title}</h2>
            </div>

            {/* Daily Notes details */}
            <div className="space-y-4">
              <h3 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-gray-200 pb-1.5">
                Section 1: Daily Pedagogical Scope
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide text-2xs mb-1">Competency Mapping</h4>
                  <p className="text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg">
                    {activeVersion.dailyNotes.competency || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide text-2xs mb-1">Competency Indicators Benchmark</h4>
                  <p className="text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg">
                    {activeVersion.dailyNotes.competencyLevel || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide text-2xs mb-1">Aims &amp; Methodology Method ({activeVersion.dailyNotes.methodology})</h4>
                <p className="text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg leading-relaxed">
                  {activeVersion.dailyNotes.aims || 'N/A'}
                </p>
              </div>

              {/* Classroom procedures timeline */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wide text-2xs mb-2">Sequential Lesson Timeline Matrix ({activeVersion.dailyNotes.approachTimeMinutes} mins total)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-3xs uppercase tracking-widest text-slate-400">
                        <th className="p-2.5 w-12 text-center">Step</th>
                        <th className="p-2.5 w-24">Entity</th>
                        <th className="p-2.5 w-24">Duration</th>
                        <th className="p-2.5">Activity Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {activeVersion.dailyNotes.proceduralActivities.map((act) => (
                        <tr key={act.seq} className="hover:bg-slate-50/50">
                          <td className="p-2.5 text-center font-mono font-bold text-slate-400">{act.seq}</td>
                          <td className="p-2.5 font-bold text-slate-700 mb-0">{act.entity}</td>
                          <td className="p-2.5 font-mono text-slate-500 font-semibold">{act.duration}</td>
                          <td className="p-2.5 text-slate-705 leading-relaxed font-medium">{act.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide text-2xs mb-1">Evaluation &amp; Assessments</h4>
                  <p className="text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg">
                    {activeVersion.dailyNotes.evaluation || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide text-2xs mb-1">Teacher Reflections Output</h4>
                  <p className="text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg italic">
                    {activeVersion.dailyNotes.reflections || 'No reflections logged for this active draft.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly notes details if they exist */}
            {activeVersion.weeklyNotes.theme && (
              <div className="space-y-4 pt-4 border-t border-gray-150">
                <h3 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-gray-200 pb-1.5">
                  Section 2: Weekly Curriculum Integration
                </h3>
                <div className="text-xs space-y-3.5 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-relaxed">
                  <p><strong>Integrated Weekly Theme:</strong> {activeVersion.weeklyNotes.theme} (Starts: {activeVersion.weeklyNotes.weekStart})</p>
                  <p><strong>Target Objectives:</strong> {activeVersion.weeklyNotes.objectives}</p>
                  <p><strong>Materials Required:</strong> {activeVersion.weeklyNotes.materials}</p>
                  <p><strong>Planned Weekly Assessments:</strong> {activeVersion.weeklyNotes.assessments}</p>
                </div>
              </div>
            )}
          </div>

          {/* SIGNATURE QUADRANTS (DIFFERENTIATED BY APPROVAL STATUS ACCORDING TO SPECIFICATIONS) */}
          <div className="mt-12 pt-8 border-t-2 border-slate-400">
            {isApproved ? (
              /* Approved plans show validation badges and exact confirmation details with timestamps */
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-emerald-950 font-semibold text-xs leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="mt-1 p-2 bg-emerald-600 rounded-xl text-white shadow"><ShieldCheck className="h-5 w-5" /></span>
                  <div>
                    <h4 className="font-bold uppercase tracking-wide text-2xs mb-1 text-emerald-800">Approved and Signed Electronically</h4>
                    <p>Verified Supervisor: <strong className="text-slate-900">{activeVersion.approvedByName || officerObj?.name || 'Academic Administration Board'}</strong></p>
                    <p>Supervisor Designation: <strong className="text-slate-800">{activeVersion.approvedByDesignation || officerObj?.role || 'Valuator'}</strong></p>
                    <p>Execution Stamp: <strong className="text-slate-800">{new Date(activeVersion.approvedAt || '').toLocaleString()}</strong></p>
                  </div>
                </div>
                <div className="text-left md:text-right text-3xs uppercase tracking-widest text-slate-400 border-t md:border-t-0 border-emerald-250 pt-2.5 md:pt-0">
                  <p>SchoolFlow Platform ID: Applet db63</p>
                  <p>Signature Lock Verified</p>
                </div>
              </div>
            ) : (
              /* Pre-approval plans feature blank signature cells for and physical validation */
              <div className="space-y-6">
                <p className="text-2xs text-amber-800 font-bold bg-amber-50 p-2.5 rounded border border-amber-100 inline-block uppercase tracking-wide mb-2">
                  Validation Hold: Requires Physical Signatures Check before approval
                </p>
                <div className="grid grid-cols-2 gap-8 text-xs">
                  {/* Instructor Signature cell */}
                  <div className="space-y-12">
                    <p className="font-bold text-slate-500 uppercase tracking-widest text-3xs">Instructor Signature</p>
                    <div className="border-t border-slate-900 pt-2 flex justify-between">
                      <span>{plan.teacherName} (Teacher)</span>
                      <span>Date: ____ / ____ / ________</span>
                    </div>
                  </div>

                  {/* Designated approval supervisor signature cell */}
                  <div className="space-y-12">
                    <p className="font-bold text-slate-500 uppercase tracking-widest text-3xs">Administrative Approver signature</p>
                    <div className="border-t border-slate-900 pt-2 flex justify-between">
                      <span>{officerObj ? `${officerObj.name} (${officerObj.role})` : 'Assigned Supervisor Off'}</span>
                      <span>Date: ____ / ____ / ________</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
