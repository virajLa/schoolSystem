import React, { useState } from 'react';
import { User, LessonPlan, LessonPlanVersion, LessonPlanStatus, DailyNotes, WeeklyNotes, UnitNotes, ProceduralActivity } from '../types';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Send,
  Eye,
  Printer,
  History,
  ArrowLeft,
  X,
  FileText,
  BadgeAlert,
  Sliders,
  Calendar,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';

interface LessonPlansProps {
  currentUser: User;
  plans: LessonPlan[];
  onSavePlan: (plan: LessonPlan) => void;
  onDeletePlan: (id: string) => void;
  onSubmitPlan: (id: string) => void;
  onPrintPreview: (plan: LessonPlan, versionNo?: string) => void;
  allUsers: User[];
}

export const LessonPlans: React.FC<LessonPlansProps> = ({
  currentUser,
  plans,
  onSavePlan,
  onDeletePlan,
  onSubmitPlan,
  onPrintPreview,
  allUsers,
}) => {
  const isTeacher = currentUser.role === 'Teacher';
  
  // Tabs: all, draft, pending, approved, rejected
  const [filterTab, setFilterTab] = useState<'all' | LessonPlanStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editing state
  const [currentEditingPlan, setCurrentEditingPlan] = useState<LessonPlan | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'daily' | 'weekly' | 'unit'>('daily');
  const [showHistoryModalFor, setShowHistoryModalFor] = useState<LessonPlan | null>(null);

  // Form State variables
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Biology');
  const [grade, setGrade] = useState('Grade 10');
  const [classSection, setClassSection] = useState('Class A');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);

  // Form subcomponents - Daily
  const [competency, setCompetency] = useState('');
  const [competencyLevel, setCompetencyLevel] = useState('');
  const [aims, setAims] = useState('');
  const [methodology, setMethodology] = useState('Problem-Based Learning');
  const [approachNotes, setApproachNotes] = useState('');
  const [approachTimeMinutes, setApproachTimeMinutes] = useState(45);
  const [proceduralActivities, setProceduralActivities] = useState<ProceduralActivity[]>([
    { seq: 1, description: 'Microscope setup guidelines and security check', duration: '10 mins', entity: 'Teacher' }
  ]);
  const [evaluation, setEvaluation] = useState('');
  const [reflections, setReflections] = useState('');

  // Weekly Sub-notes
  const [weekStart, setWeekStart] = useState(new Date().toISOString().split('T')[0]);
  const [weeklyTheme, setWeeklyTheme] = useState('');
  const [weeklyObjectives, setWeeklyObjectives] = useState('');
  const [weeklyMaterials, setWeeklyMaterials] = useState('');
  const [weeklyHighlights, setWeeklyHighlights] = useState('');
  const [weeklyAssessments, setWeeklyAssessments] = useState('');

  // Unit Sub-notes
  const [unitTitle, setUnitTitle] = useState('');
  const [unitObjectives, setUnitObjectives] = useState('');
  const [unitTopics, setUnitTopics] = useState('');
  const [unitResources, setUnitResources] = useState('');
  const [unitAssessmentPlan, setUnitAssessmentPlan] = useState('');

  // Filter plans based on roles:
  // Teachers only see their own plans. Admins and Principal/Approvers see all (though they can't necessarily edit approved).
  const visiblePlans = plans.filter((p) => {
    // Audit filters
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = filterTab === 'all' ? true : p.status === filterTab;
    
    if (isTeacher) {
      return p.teacherId === currentUser.id && matchesSearch && matchesTab;
    }
    return matchesSearch && matchesTab; // managers see all
  });

  const startNewPlan = () => {
    setTitle('Untitled System Lesson Plan');
    setSubject('Science');
    setGrade('Grade 10');
    setClassSection('Class A');
    setDateStr(new Date().toISOString().split('T')[0]);

    setCompetency('');
    setCompetencyLevel('');
    setAims('');
    setMethodology('Direct Instruction');
    setApproachNotes('');
    setApproachTimeMinutes(45);
    setProceduralActivities([
      { seq: 1, description: 'Starting introduction review class', duration: '10 mins', entity: 'Teacher' }
    ]);
    setEvaluation('');
    setReflections('');

    setWeekStart(new Date().toISOString().split('T')[0]);
    setWeeklyTheme('');
    setWeeklyObjectives('');
    setWeeklyMaterials('');
    setWeeklyHighlights('');
    setWeeklyAssessments('');

    setUnitTitle('');
    setUnitObjectives('');
    setUnitTopics('');
    setUnitResources('');
    setUnitAssessmentPlan('');

    setIsCreatingNew(true);
    setCurrentEditingPlan(null);
    setActiveFormTab('daily');
  };

  const startEditPlan = (plan: LessonPlan) => {
    // Load latest version for initial editing
    const latestVersion = plan.versions && plan.versions.length > 0 ? plan.versions[plan.versions.length - 1] : null;
    
    setTitle(plan.title || '');
    setSubject(plan.subject || 'Biology');
    setGrade(plan.grade || 'Grade 10');
    setClassSection(plan.classSection || 'Class A');
    setDateStr(plan.date || new Date().toISOString().split('T')[0]);

    // Sub state
    setCompetency(latestVersion?.dailyNotes?.competency || '');
    setCompetencyLevel(latestVersion?.dailyNotes?.competencyLevel || '');
    setAims(latestVersion?.dailyNotes?.aims || '');
    setMethodology(latestVersion?.dailyNotes?.methodology || 'Problem-Based Learning');
    setApproachNotes(latestVersion?.dailyNotes?.approachNotes || '');
    setApproachTimeMinutes(latestVersion?.dailyNotes?.approachTimeMinutes || 45);
    setProceduralActivities([...(latestVersion?.dailyNotes?.proceduralActivities || [])]);
    setEvaluation(latestVersion?.dailyNotes?.evaluation || '');
    setReflections(latestVersion?.dailyNotes?.reflections || '');

    setWeekStart(latestVersion?.weeklyNotes?.weekStart || new Date().toISOString().split('T')[0]);
    setWeeklyTheme(latestVersion?.weeklyNotes?.theme || '');
    setWeeklyObjectives(latestVersion?.weeklyNotes?.objectives || '');
    setWeeklyMaterials(latestVersion?.weeklyNotes?.materials || '');
    setWeeklyHighlights(latestVersion?.weeklyNotes?.highlights || '');
    setWeeklyAssessments(latestVersion?.weeklyNotes?.assessments || '');

    setUnitTitle(latestVersion?.unitNotes?.unitTitle || '');
    setUnitObjectives(latestVersion?.unitNotes?.unitObjectives || '');
    setUnitTopics(latestVersion?.unitNotes?.topics || '');
    setUnitResources(latestVersion?.unitNotes?.resources || '');
    setUnitAssessmentPlan(latestVersion?.unitNotes?.assessmentPlan || '');

    setCurrentEditingPlan(plan);
    setIsCreatingNew(false);
    setActiveFormTab('daily');
  };

  const handleAddProceduralActivity = () => {
    const currentList = proceduralActivities || [];
    const newSeq = currentList.length + 1;
    setProceduralActivities([
      ...currentList,
      { seq: newSeq, description: '', duration: '15 mins', entity: 'Student' }
    ]);
  };

  const handleUpdateProceduralActivity = (index: number, fields: Partial<ProceduralActivity>) => {
    const currentList = proceduralActivities || [];
    const updated = [...currentList];
    if (updated[index]) {
      updated[index] = { ...updated[index], ...fields };
    }
    setProceduralActivities(updated);
  };

  const handleRemoveProceduralActivity = (index: number) => {
    const currentList = proceduralActivities || [];
    const updated = currentList.filter((_, i) => i !== index).map((act, i) => ({
      ...act,
      seq: i + 1
    }));
    setProceduralActivities(updated);
  };

  const handleSave = () => {
    const dailyNotes: DailyNotes = {
      competency,
      competencyLevel,
      aims,
      methodology,
      approachNotes,
      approachTimeMinutes,
      proceduralActivities,
      evaluation,
      reflections,
    };

    const weeklyNotes: WeeklyNotes = {
      weekStart,
      theme: weeklyTheme,
      objectives: weeklyObjectives,
      materials: weeklyMaterials,
      highlights: weeklyHighlights,
      assessments: weeklyAssessments,
    };

    const unitNotes: UnitNotes = {
      unitTitle,
      unitObjectives,
      topics: unitTopics,
      resources: unitResources,
      assessmentPlan: unitAssessmentPlan,
    };

    if (isCreatingNew) {
      // Setup initial version
      const initialVersion: LessonPlanVersion = {
        id: `lpv-${Date.now()}`,
        planId: `lp-${Date.now()}`,
        versionNo: '0.1',
        title,
        status: 'draft',
        dailyNotes,
        weeklyNotes,
        unitNotes,
        createdAt: new Date().toISOString(),
      };

      const newPlan: LessonPlan = {
        id: `lp-${Date.now()}`,
        title,
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        subject,
        grade,
        classSection,
        date: dateStr,
        status: 'draft',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        currentVersionNo: '0.1',
        versions: [initialVersion]
      };

      onSavePlan(newPlan);
      setIsCreatingNew(false);
    } else if (currentEditingPlan) {
      // IMPLEMENTATION OF SPECIFIC VERSION CONTROL SYSTEM:
      // - If the current status is APPROVED, editing does not override. It creates a NEW version (e.g. 1.0 -> 1.1)
      //   and switches status back to "draft" for the new version while leaving previous versions untouched!
      const isApproved = currentEditingPlan.status === 'approved';
      
      const newVersionNo = isApproved
        ? (parseFloat(currentEditingPlan.currentVersionNo) + 0.1).toFixed(1)
        : currentEditingPlan.currentVersionNo;

      const newVersion: LessonPlanVersion = {
        id: `lpv-${Date.now()}`,
        planId: currentEditingPlan.id,
        versionNo: newVersionNo,
        title,
        status: 'draft', // editing shifts state back to draft for the new version
        dailyNotes,
        weeklyNotes,
        unitNotes,
        createdAt: new Date().toISOString(),
      };

      const updatedPlan: LessonPlan = {
        ...currentEditingPlan,
        title,
        subject,
        grade,
        classSection,
        date: dateStr,
        status: 'draft', // Lock breaks, resets back to draft
        lastModified: new Date().toISOString(),
        currentVersionNo: newVersionNo,
        versions: [...currentEditingPlan.versions, newVersion]
      };

      onSavePlan(updatedPlan);
      setCurrentEditingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Selector */}
      {!currentEditingPlan && !isCreatingNew ? (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider">Lesson Plans Matrix</h2>
              <p className="text-3xs text-gray-500 font-medium">Create lesson plans linked instantly to timetable matrices.</p>
            </div>
            {isTeacher && (
              <button
                id="btn-new-plan"
                onClick={startNewPlan}
                className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs px-4 py-2.5 rounded-xl text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5" />
                Draft New Plan
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto">
              {(['all', 'draft', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  id={`tab-filter-${tab}`}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-3xs font-extrabold uppercase transition-colors select-none cursor-pointer ${
                    filterTab === tab
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab} ({plans.filter(p => isTeacher ? p.teacherId === currentUser.id && (tab === 'all' ? true : p.status === tab) : (tab === 'all' ? true : p.status === tab)).length})
                </button>
              ))}
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search plans or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Grid Content */}
          {visiblePlans.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200/80">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-600">No lesson plans matching criteria</p>
              <p className="text-xs text-gray-400 mt-1">Start writing lesson logs by clicking Draft New Plan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visiblePlans.map((plan) => {
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
                    <span className="bg-amber-100 text-amber-800 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase animate-pulse">
                      Pending Approval
                    </span>
                  );
                } else if (isRejected) {
                  statusBadge = (
                    <span className="bg-rose-100 text-rose-800 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Rejected
                    </span>
                  );
                }

                // Retrieve the assigned officer if configured to display help
                const teacherObj = allUsers.find(u => u.id === plan.teacherId);
                const officerObj = allUsers.find(u => u.id === teacherObj?.assignedOfficerId);

                return (
                  <div
                    key={plan.id}
                    className={`bg-white border p-5 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-5 relative overflow-hidden ${
                      isApproved ? 'border-emerald-200/60' : 'border-gray-200/80'
                    }`}
                  >
                    {isApproved && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-3xs px-3 py-1 font-black rounded-bl-xl tracking-wider">
                        LOCKED READ-ONLY
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2.5">
                        <div className="space-y-1">
                          <p className="text-3xs tracking-wider uppercase font-black text-slate-400">
                            {plan.grade} &bull; {plan.subject}
                          </p>
                          <h3 className="font-sans font-extrabold text-sm text-gray-900 leading-snug">
                            {plan.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap mt-3">
                        {statusBadge}
                        <span className="text-2xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          v{plan.currentVersionNo}
                        </span>
                        <span className="text-2xs font-bold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {plan.date}
                        </span>
                      </div>

                      {!isTeacher && (
                        <p className="text-3xs text-gray-500 mt-3.5 font-semibold">
                          Author: <span className="text-slate-800 font-extrabold">{plan.teacherName}</span>
                        </p>
                      )}

                      {isPending && officerObj && (
                        <div className="mt-3.5 bg-amber-50/50 border border-amber-200/50 p-2 rounded-lg text-3xs text-amber-900 leading-tight">
                          Routed cleanly to: <strong>{officerObj.name}</strong> ({officerObj.role})
                        </div>
                      )}

                      {isRejected && plan.versions[plan.versions.length - 1].remarks && (
                        <div className="mt-3.5 bg-rose-50 border border-rose-100 p-2.5 rounded-lg text-3xs text-rose-950">
                          <strong>Mandatory Remarks:</strong> &ldquo;{plan.versions[plan.versions.length - 1].remarks}&rdquo;
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex flex-wrap justify-between items-center gap-2">
                      <div className="flex gap-1.5">
                        <button
                          id={`btn-history-${plan.id}`}
                          onClick={() => setShowHistoryModalFor(plan)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          title="View Version Timeline History"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        <button
                          id={`btn-print-${plan.id}`}
                          onClick={() => onPrintPreview(plan)}
                          className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Print Document"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {isTeacher && (
                          <button
                            id={`btn-delete-${plan.id}`}
                            onClick={() => onDeletePlan(plan.id)}
                            className="bg-white hover:bg-rose-50 text-rose-500 p-1.5 rounded-lg transition-all border border-rose-100 cursor-pointer"
                            title="Delete Plan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}

                        {plan.status === 'draft' && isTeacher && (
                          <button
                            id={`btn-submit-${plan.id}`}
                            onClick={() => onSubmitPlan(plan.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-3xs px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Send className="h-3 w-3" />
                            Submit Review
                          </button>
                        )}

                        <button
                          id={`btn-edit-${plan.id}`}
                          onClick={() => startEditPlan(plan)}
                          className={`font-semibold text-3xs px-2.5 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-all ${
                            isApproved
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                          }`}
                        >
                          <Edit2 className="h-3 w-3" />
                          {isApproved ? 'Edit approved (Fork version)' : 'Modify'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Plan Authoring Form (Create / Edit Mode) */
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-gray-150 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                id="btn-form-back"
                onClick={() => {
                  setCurrentEditingPlan(null);
                  setIsCreatingNew(false);
                }}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 text-gray-500" />
              </button>
              <div>
                <span className="text-3xs uppercase tracking-wider font-extrabold text-gray-400">
                  {isCreatingNew ? 'Drafting New File' : 'Editing File - Version Control Protected'}
                </span>
                <h3 className="font-sans font-bold text-gray-900 text-sm">
                  {isCreatingNew ? 'Creating Classroom Lesson Log' : `Modifying: ${title}`}
                </h3>
              </div>
            </div>
            <button
              id="btn-form-save"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs px-4 py-2 rounded-lg text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Save Version Log
            </button>
          </div>

          {/* Timetable Assignment & Title Banner */}
          <div className="p-5 border-b border-gray-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Lesson Plan Core Title
              </label>
              <input
                id="form-input-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Microorganisms & Cytology foundations..."
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Academic Grade
              </label>
              <select
                id="form-select-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Class Section
              </label>
              <select
                id="form-select-class"
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                {['Class A', 'Class B', 'Class C', 'Class D'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Date Assigned
              </label>
              <input
                id="form-input-date"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Specific Lesson Sections Navigation Toggles */}
          <div className="flex border-b border-gray-150 bg-slate-50">
            {[
              { id: 'daily', label: 'Daily Notes Templates' },
              { id: 'weekly', label: 'Weekly Curriculum Blocks' },
              { id: 'unit', label: 'Unit Scope & Sequences' },
            ].map((section) => (
              <button
                key={section.id}
                id={`btn-form-section-${section.id}`}
                onClick={() => setActiveFormTab(section.id as any)}
                className={`px-5 py-3 text-3xs font-black uppercase tracking-wider border-r border-gray-100 cursor-pointer select-none transition-colors ${
                  activeFormTab === section.id
                    ? 'bg-white text-emerald-700 border-t-2 border-t-emerald-600 font-black'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Forms Body Area */}
          <div className="p-6">
            {activeFormTab === 'daily' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Required Competency</label>
                    <textarea
                      id="daily-competency"
                      value={competency}
                      onChange={(e) => setCompetency(e.target.value)}
                      placeholder="e.g. Synthesize chemical oxidation parameters..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Competency Level Index</label>
                    <textarea
                      id="daily-competency-level"
                      value={competencyLevel}
                      onChange={(e) => setCompetencyLevel(e.target.value)}
                      placeholder="e.g. Synthesis level index 4.2..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Specific Learning Aims</label>
                    <input
                      id="daily-aims"
                      type="text"
                      value={aims}
                      onChange={(e) => setAims(e.target.value)}
                      placeholder="Explain molecular pathways and outline experimental hazards..."
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Core Methodology Choice</label>
                    <select
                      id="daily-methodology"
                      value={methodology}
                      onChange={(e) => setMethodology(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      {[
                        'Problem-Based Learning',
                        'Direct Instruction',
                        'Flipped Classroom',
                        'Experimental Discovery',
                        'Cooperative Matrices',
                        'Inquiry-Based Learning',
                      ].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Interactive Procedural Activities Timeline Table */}
                <div className="border border-gray-150 rounded-xl overflow-hidden shadow-2xs bg-slate-50/20">
                  <div className="p-3 bg-slate-100 border-b border-gray-150 flex justify-between items-center">
                    <div>
                      <span className="text-3xs uppercase tracking-widest font-extrabold text-slate-500">Interactive Classroom Procedure</span>
                      <h4 className="text-xs font-bold text-slate-800">Sequential Execution Timeline Matrix</h4>
                    </div>
                    <button
                      type="button"
                      id="btn-add-procedural"
                      onClick={handleAddProceduralActivity}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-3xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Add Sequential Task
                    </button>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold text-3xs uppercase tracking-widest border-b border-gray-150">
                        <th className="p-2.5 w-12 text-center">SEQ</th>
                        <th className="p-2.5 w-32">ENTITY ACTION</th>
                        <th className="p-2.5 w-24">DURATION</th>
                        <th className="p-2.5">TASK DESCRIPTION</th>
                        <th className="p-2.5 w-16 text-center">OPS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {proceduralActivities.map((act, index) => (
                        <tr key={index} className="bg-white hover:bg-slate-50/50">
                          <td className="p-2.5 text-center font-mono font-bold text-xs text-gray-400">
                            {act.seq}
                          </td>
                          <td className="p-2.5">
                            <select
                              value={act.entity}
                              onChange={(e) => handleUpdateProceduralActivity(index, { entity: e.target.value as any })}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white outline-none"
                            >
                              <option value="Teacher">Teacher</option>
                              <option value="Student">Student</option>
                              <option value="Group">Group Matrix</option>
                            </select>
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={act.duration}
                              onChange={(e) => handleUpdateProceduralActivity(index, { duration: e.target.value })}
                              placeholder="10 mins"
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none font-mono"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={act.description}
                              onChange={(e) => handleUpdateProceduralActivity(index, { description: e.target.value })}
                              placeholder="Reviewing materials or conducting individual quizzes..."
                              className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none"
                            />
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveProceduralActivity(index)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Delete Step"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Evaluation Criteria Slot</label>
                    <textarea
                      id="daily-evaluation"
                      value={evaluation}
                      onChange={(e) => setEvaluation(e.target.value)}
                      placeholder="Oral questions evaluating Mitosis transitions or multi-step written test..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Teacher Reflection Log</label>
                    <textarea
                      id="daily-reflections"
                      value={reflections}
                      onChange={(e) => setReflections(e.target.value)}
                      placeholder="Add reflections on classroom pacing, lesson hurdles, and student responses..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeFormTab === 'weekly' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Week Start Date</label>
                    <input
                      type="date"
                      value={weekStart}
                      onChange={(e) => setWeekStart(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Weekly Integrated Theme</label>
                    <input
                      type="text"
                      value={weeklyTheme}
                      onChange={(e) => setWeeklyTheme(e.target.value)}
                      placeholder="Structure of living matrix networks..."
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Weekly High-Level Objectives</label>
                  <textarea
                    value={weeklyObjectives}
                    onChange={(e) => setWeeklyObjectives(e.target.value)}
                    placeholder="List milestones expected by the conclusion of the week..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Materials &amp; Aids Required</label>
                    <textarea
                      value={weeklyMaterials}
                      onChange={(e) => setWeeklyMaterials(e.target.value)}
                      placeholder="Slides, software references, lab test tubes..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Special Weekly highlights</label>
                    <textarea
                      value={weeklyHighlights}
                      onChange={(e) => setWeeklyHighlights(e.target.value)}
                      placeholder="Outdoor experiments, digital projection slides..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Planned Weekly Assessments</label>
                  <textarea
                    value={weeklyAssessments}
                    onChange={(e) => setWeeklyAssessments(e.target.value)}
                    placeholder="Quizzes, mock exams, or individual homework checklists..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none font-medium"
                  />
                </div>
              </div>
            )}

            {activeFormTab === 'unit' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Unit Chapter Title</label>
                    <input
                      type="text"
                      value={unitTitle}
                      onChange={(e) => setUnitTitle(e.target.value)}
                      placeholder="Unit 3: Biology of Energetics..."
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Strategic Unit Resources</label>
                    <input
                      type="text"
                      value={unitResources}
                      onChange={(e) => setUnitResources(e.target.value)}
                      placeholder="Aha curriculum guides, GeoGebra online datasets..."
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Core Unit Objectives</label>
                  <textarea
                    value={unitObjectives}
                    onChange={(e) => setUnitObjectives(e.target.value)}
                    placeholder="Translate constraints, configure biochemical charts, analyze systems safety..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Unit Topics breakdown list</label>
                  <textarea
                    value={unitTopics}
                    onChange={(e) => setUnitTopics(e.target.value)}
                    placeholder="Topic 1, Topic 2, Topic 3 with summaries..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Integrated Post-Unit Assessment Plan</label>
                  <textarea
                    value={unitAssessmentPlan}
                    onChange={(e) => setUnitAssessmentPlan(e.target.value)}
                    placeholder="Research project reports and comprehensive curriculum test..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Version Control Flow modal */}
      {showHistoryModalFor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="text-3xs uppercase font-extrabold text-slate-400 tracking-wider">Separate Version Logs</span>
                <h3 className="font-sans font-bold text-sm">Chronological Versions: {showHistoryModalFor.title}</h3>
              </div>
              <button
                onClick={() => setShowHistoryModalFor(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Approved lesson plans lock automatically. Form modifications prompt dynamic version increments, saving previous commits as historical records.
              </p>
              <div className="relative border-l border-gray-200 pl-5 ml-2.5 space-y-5">
                {showHistoryModalFor.versions.map((ver, idx) => {
                  return (
                    <div key={ver.id} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-8.5 top-1.5 h-4.5 w-4.5 rounded-full bg-slate-100 border-2 border-slate-700 flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <div className="bg-slate-50/50 hover:bg-slate-50 border border-gray-200 p-4 rounded-xl">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-2xs font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                              v{ver.versionNo}
                            </span>
                            <span className="text-3xs text-gray-400 font-bold ml-2">
                              {new Date(ver.createdAt || '').toLocaleString()}
                            </span>
                            <p className="font-bold text-gray-800 text-xs mt-2">{ver.title}</p>
                          </div>
                          <button
                            onClick={() => onPrintPreview(showHistoryModalFor, ver.versionNo)}
                            className="text-3xs font-extrabold text-slate-700 hover:text-emerald-700 hover:bg-white border border-gray-200/80 px-2 py-1 rounded shadow-2xs cursor-pointer bg-white"
                          >
                            Print v{ver.versionNo}
                          </button>
                        </div>
                        {ver.remarks && (
                          <div className="mt-3 bg-rose-50 border border-rose-100/50 p-2.5 rounded-lg text-3xs text-rose-950">
                            <strong>Approver Comment:</strong> &ldquo;{ver.remarks}&rdquo;
                          </div>
                        )}
                        {ver.approvedByName && (
                          <div className="mt-2.5 flex items-center gap-2 text-3xs text-emerald-800 font-bold leading-none bg-emerald-50/60 p-1.5 rounded">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approved by: {ver.approvedByName} ({ver.approvedByDesignation})
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-gray-150 flex justify-end">
              <button
                onClick={() => setShowHistoryModalFor(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-3xs rounded-lg cursor-pointer"
              >
                Close History Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
