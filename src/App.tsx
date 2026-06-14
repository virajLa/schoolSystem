import React, { useState, useEffect } from 'react';
import { User, LessonPlan, LeaveRequest, AuditLog, SystemSettings, LeaveBalance } from './types';
import { initializeStorage, resetAllData } from './data';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LessonPlans } from './components/LessonPlans';
import { ApprovalQueue } from './components/ApprovalQueue';
import { LeaveRequestTab } from './components/LeaveRequest';
import { CalendarView } from './components/CalendarView';
import { Reports } from './components/Reports';
import { UserManagement } from './components/UserManagement';
import { SettingsTab } from './components/Settings';
import { AuditLogs } from './components/AuditLogs';
import { PrintPreview } from './components/PrintPreview';
import { Login } from './components/Login';

export default function App() {
  // Ensure storage is initialized
  useEffect(() => {
    initializeStorage();
  }, []);

  // State Management linked to Local Storage
  const [activeUser, setActiveUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('sf_active_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return null; // Require login first
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const raw = localStorage.getItem('sf_users');
    return raw ? JSON.parse(raw) : [];
  });

  const [plans, setPlans] = useState<LessonPlan[]>(() => {
    const raw = localStorage.getItem('sf_plans');
    return raw ? JSON.parse(raw) : [];
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const raw = localStorage.getItem('sf_leaves');
    return raw ? JSON.parse(raw) : [];
  });

  const [balances, setBalances] = useState<Record<string, LeaveBalance>>(() => {
    const raw = localStorage.getItem('sf_balances');
    return raw ? JSON.parse(raw) : {};
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const raw = localStorage.getItem('sf_settings');
    const defaultSettings: SystemSettings = {
      smtpHost: 'smtp.schoolflow.edu',
      smtpPort: '587',
      smtpUser: 'no-reply@schoolflow.edu',
      smsGateway: 'Ceyora SMS API Gateway',
      smsApiKey: 'cey_sk_8f2a93b41cd99e32ff721aee',
      maxUploadSizeMB: 10,
      allowedTypes: 'PDF, JPG, PNG, DOCX',
      retentionYears: 3,
    };
    return raw ? JSON.parse(raw) : defaultSettings;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const raw = localStorage.getItem('sf_audit');
    return raw ? JSON.parse(raw) : [];
  });

  const [notifications, setNotifications] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [printTargetPlan, setPrintTargetPlan] = useState<LessonPlan | null>(null);
  const [printTargetVersion, setPrintTargetVersion] = useState<string | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronize dynamic updates back to local storage
  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem('sf_users', JSON.stringify(allUsers));
    }
  }, [allUsers]);

  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem('sf_plans', JSON.stringify(plans));
    }
  }, [plans]);

  useEffect(() => {
    if (leaves.length > 0) {
      localStorage.setItem('sf_leaves', JSON.stringify(leaves));
    }
  }, [leaves]);

  useEffect(() => {
    if (Object.keys(balances).length > 0) {
      localStorage.setItem('sf_balances', JSON.stringify(balances));
    }
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('sf_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (auditLogs.length > 0) {
      localStorage.setItem('sf_audit', JSON.stringify(auditLogs));
    }
  }, [auditLogs]);

  // SYSTEM LOG UTILITY
  const writeLog = (action: string, entity: string, entityId: string, details: string, status: 'SUCCESS' | 'BLOCKED' | 'WARNING' = 'SUCCESS') => {
    if (!activeUser) return;
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action,
      entity,
      entityId,
      details,
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // IDENTITY / SESSION LOGIN HANDLER
  const handleLogin = (user: User) => {
    setActiveUser(user);
    localStorage.setItem('sf_active_user', JSON.stringify(user));
    
    // Log login session
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'User Login',
      entity: 'System Session',
      entityId: user.id,
      details: `Logged in as ${user.role} (${user.department}) - Active Authorization Verified`,
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    
    setNotifications([`Access Granted: Welcome back, ${user.name}.`]);
    setActiveTab('dashboard');
  };

  // IDENTITY / SESSION LOGOUT HANDLER
  const handleLogout = () => {
    if (activeUser) {
      const newLog: AuditLog = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: activeUser.id,
        userName: activeUser.name,
        userRole: activeUser.role,
        action: 'User Logout',
        entity: 'System Session',
        entityId: activeUser.id,
        details: `Logged out from session cleanly and revoked authorization token`,
        status: 'SUCCESS',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
    setActiveUser(null);
    localStorage.removeItem('sf_active_user');
    setNotifications([]);
  };

  // 1. LESSON PLAN MUTATORS & VERSION CONTROLS
  const handleSavePlan = (updatedPlan: LessonPlan) => {
    setPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === updatedPlan.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = updatedPlan;
        return copy;
      }
      return [updatedPlan, ...prev];
    });

    writeLog('Edit Record', 'Lesson Plan', updatedPlan.id, `Saved version log v${updatedPlan.currentVersionNo} for: "${updatedPlan.title}"`);
    setNotifications((prev) => [`Successfully saved draft: ${updatedPlan.title} (v${updatedPlan.currentVersionNo})`, ...prev]);
  };

  const handleDeletePlan = (id: string) => {
    const target = plans.find((p) => p.id === id);
    if (!target) return;

    setPlans((prev) => prev.filter((p) => p.id !== id));
    writeLog('Delete Record', 'Lesson Plan', id, `Removed lesson plan file: "${target.title}"`);
    setNotifications((prev) => [`Deleted plan: ${target.title}`, ...prev]);
  };

  const handleSubmitPlanForReview = (id: string) => {
    const updated = plans.map((p) => {
      if (p.id === id) {
        // Change status to pending
        const versionsCopy = [...p.versions];
        const latest = { ...versionsCopy[versionsCopy.length - 1], status: 'pending' as const };
        versionsCopy[versionsCopy.length - 1] = latest;

        return {
          ...p,
          status: 'pending' as const,
          versions: versionsCopy,
        };
      }
      return p;
    });

    setPlans(updated);
    const plan = plans.find((p) => p.id === id);
    if (plan) {
      writeLog('Submit Record', 'Lesson Plan', id, `Submitted lesson mitosis: "${plan.title}" version v${plan.currentVersionNo} for approval routing`);
      
      // Look up assigned officer
      const teacher = allUsers.find(u => u.id === plan.teacherId);
      const officer = allUsers.find(u => u.id === teacher?.assignedOfficerId);
      const targetName = officer ? `${officer.name} (${officer.role})` : 'Administrative board';

      setNotifications((prev) => [
        `Plan Submitted: Routed mitosis to ${targetName} for review.`,
        ...prev
      ]);
    }
  };

  // 2. APPROVAL DESK HANDLERS: APPROVE / REJECT
  const handleApprovePlan = (planId: string, versionNo: string, officer: User, remarksStr: string) => {
    const updated = plans.map((plan) => {
      if (plan.id === planId) {
        const versionsCopy = plan.versions.map((ver) => {
          if (ver.versionNo === versionNo) {
            return {
              ...ver,
              status: 'approved' as const,
              remarks: remarksStr || 'Deemed fully compliant',
              approvedBy: officer.id,
              approvedByName: officer.name,
              approvedByDesignation: officer.role,
              approvedAt: new Date().toISOString(),
            };
          }
          return ver;
        });

        return {
          ...plan,
          status: 'approved' as const,
          versions: versionsCopy,
        };
      }
      return plan;
    });

    setPlans(updated);
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      writeLog('Approve Record', 'Lesson Plan', planId, `Officially approved: "${plan.title}" v${versionNo} by ${officer.name} (${officer.role})`);
      
      // Simulated Email Log or SMS Log
      console.log(`[SMTP Notifications Log] Recipient: ${plan.teacherId}. Subject: Lesson Approved. Details: "${plan.title}" signing complete.`);
      console.log(`[Ceyora SMS Gateway Log] Sent SMS to Instructor of "${plan.title}". Status: Delivered.`);

      setNotifications((prev) => [
        `Decision Approved: ${plan.title} (v${versionNo}) signed off and locked.`,
        ...prev
      ]);
    }
  };

  const handleRejectPlan = (planId: string, versionNo: string, officer: User, remarksStr: string) => {
    const updated = plans.map((plan) => {
      if (plan.id === planId) {
        const versionsCopy = plan.versions.map((ver) => {
          if (ver.versionNo === versionNo) {
            return {
              ...ver,
              status: 'rejected' as const,
              remarks: remarksStr, // remarks are mandatory on rejection inputs
            };
          }
          return ver;
        });

        return {
          ...plan,
          status: 'rejected' as const,
          versions: versionsCopy,
        };
      }
      return plan;
    });

    setPlans(updated);
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      writeLog('Reject Record', 'Lesson Plan', planId, `Rejected lesson log: "${plan.title}" v${versionNo} citing criteria. Remarks: "${remarksStr}"`);
      
      // Simulated Email/SMS
      console.log(`[SMTP Notifications Log] Recipient: ${plan.teacherId}. Subject: Revision Required. Remarks: ${remarksStr}`);
      console.log(`[Ceyora SMS Gateway Log] Sent SMS response tracking to instructor cell.`);

      setNotifications((prev) => [
        `Decision Refused: ${plan.title} (v${versionNo}) requires necessary revisions.`,
        ...prev
      ]);
    }
  };

  // 3. LEAVE SUBMISSION & DECREMENT LOGIC BASED ON BALANCE limits
  const handleLeaveSubmit = (newReq: LeaveRequest) => {
    setLeaves((prev) => [newReq, ...prev]);
    writeLog('Create Record', 'Leave Request', newReq.id, `Successfully logged ${newReq.type} Absence from ${newReq.startDate} to ${newReq.endDate}`);
  };

  const handleApproveLeave = (leaveId: string, officer: User, remarksStr: string) => {
    const targetLeave = leaves.find((l) => l.id === leaveId);
    if (!targetLeave) return;

    // Days calculation (inclusive)
    const start = new Date(targetLeave.startDate);
    const end = new Date(targetLeave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Deduct corresponding days from active balance limits
    setBalances((prev) => {
      const userBal = prev[targetLeave.teacherId] || { Annual: 14, Sick: 8, Casual: 5 };
      const category = targetLeave.type as keyof LeaveBalance;
      
      const newCategoryBal = Math.max(0, (userBal[category] || 0) - requestedDays);
      return {
        ...prev,
        [targetLeave.teacherId]: {
          ...userBal,
          [category]: newCategoryBal,
        },
      };
    });

    // Update status mapping
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === leaveId) {
          return {
            ...l,
            status: 'approved' as const,
            remarks: remarksStr || 'Deemed fully justified',
            approvedBy: officer.id,
            approvedByName: officer.name,
            approvedByDesignation: officer.role,
            approvedAt: new Date().toISOString(),
          };
        }
        return l;
      })
    );

    writeLog('Approve Record', 'Leave Request', leaveId, `Approved ${targetLeave.type} Leave for ${targetLeave.teacherName} spanning ${requestedDays} days.`);
    setNotifications((prev) => [`Leave Approved: Sarah Jenkins/David Miller Absence validated.`, ...prev]);
  };

  const handleRejectLeave = (leaveId: string, officer: User, remarksStr: string) => {
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === leaveId) {
          return {
            ...l,
            status: 'rejected' as const,
            remarks: remarksStr || 'Lacks supporting evidence',
          };
        }
        return l;
      })
    );

    const targetLeave = leaves.find((l) => l.id === leaveId);
    if (targetLeave) {
      writeLog('Reject Record', 'Leave Request', leaveId, `Rejected leave request for ${targetLeave.teacherName}. Remarks: ${remarksStr}`);
      setNotifications((prev) => [`Leave Suspended: Request denied by administration.`, ...prev]);
    }
  };

  // 4. PRINCIPAL MAPPED ASSOCIATIONS MUTATIONS
  const handleUpdateOfficerMapping = (teacherId: string, officerId: string) => {
    const updatedUsers = allUsers.map((user) => {
      if (user.id === teacherId) {
        return {
          ...user,
          assignedOfficerId: officerId || undefined,
        };
      }
      return user;
    });

    setAllUsers(updatedUsers);
    
    // Look up names for logging
    const teacher = allUsers.find(u => u.id === teacherId);
    const officer = allUsers.find(u => u.id === officerId);
    const officerDesc = officer ? `${officer.name} (${officer.role})` : 'Unassigned';

    writeLog('System Configuration Changes', 'User Mapping', teacherId, `Mapped Teacher "${teacher?.name}" to Validation Officer: "${officerDesc}"`);
    setNotifications((prev) => [`Assigned Officer mapping successfully locked: ${teacher?.name} -> ${officer?.name || 'None'}`, ...prev]);
  };

  // 4b. USER LOGIN MANAGEMENT (SUPER ADMIN SEAT CONTROLS)
  const handleAddUser = (user: User) => {
    setAllUsers((prev) => [...prev, user]);
    writeLog('System Configuration Changes', 'User Login Creation', user.id, `Created new User login for: "${user.name}" (${user.role}) with email "${user.email}"`);
    setNotifications((prev) => [`Successfully created new user account: ${user.name}`, ...prev]);
  };

  const handleUpdateUser = (userId: string, updatedFields: Partial<User>) => {
    setAllUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...updatedFields } : user))
    );
    writeLog('System Configuration Changes', 'User Login Modification', userId, `Modified login configuration for user ID: ${userId}`);
    setNotifications((prev) => [`User configurations successfully updated.`, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    if (activeUser && activeUser.id === userId) {
      setNotifications((prev) => [`Error: You cannot delete your own active administrator account.`, ...prev]);
      return;
    }
    const userToDelete = allUsers.find((u) => u.id === userId);
    setAllUsers((prev) => prev.filter((user) => user.id !== userId));
    writeLog('System Configuration Changes', 'User Login Deletion', userId, `Deleted User login: "${userToDelete?.name || userId}" (${userToDelete?.role || ''})`);
    setNotifications((prev) => [`Successfully deleted user workspace: ${userToDelete?.name || 'User'}`, ...prev]);
  };

  // 5. COMPLIANCE CLEANUP FOR 3-YEAR DELETION MANDATES
  const handleTriggerCleanup = () => {
    // Threshold date - exactly 3 years prior to now
    const limitDate = new Date();
    limitDate.setFullYear(limitDate.getFullYear() - settings.retentionYears);

    const initialPlanCount = plans.length;
    
    // Filter out approved plans with dates exceeding retention limit
    const maintainedPlans = plans.filter((p) => {
      if (p.status !== 'approved') return true; // keep drafts/pendings
      const planDate = new Date(p.date);
      return planDate >= limitDate; // keep if newer than threshold
    });

    const deletedCount = initialPlanCount - maintainedPlans.length;

    setPlans(maintainedPlans);
    writeLog('System Configuration Changes', 'Retention Policy', 'sys', `Executed purging Pass: Deleted ${deletedCount} legacy records exceeding the mandated ${settings.retentionYears}-year retention limit.`);
    
    setNotifications((prev) => [
      `Purge sweep complete. ${deletedCount} item(s) older than ${settings.retentionYears} year(s) deposed.`,
      ...prev
    ]);
  };

  const handleSaveSettings = (updatedSettings: SystemSettings) => {
    setSettings(updatedSettings);
    writeLog('System Configuration Changes', 'Settings', 'sys', 'Saved modified SMTP configurations and Ceyora SMS endpoint secrets.');
  };

  // 6. PRINT TRIGGERS
  const handlePrintPreviewTrigger = (planTarget: LessonPlan, versionNoTarget?: string) => {
    setPrintTargetPlan(planTarget);
    setPrintTargetVersion(versionNoTarget);
  };

  const handleBulkPrintTrigger = (plansToPrint: LessonPlan[]) => {
    if (plansToPrint.length === 0) return;
    // Set first matched to print for mockup validation
    setPrintTargetPlan(plansToPrint[0]);
    setPrintTargetVersion(undefined);
  };

  // Display Login Page if there is no active authenticated session
  if (!activeUser) {
    return <Login allUsers={allUsers} onLogin={handleLogin} auditLogs={auditLogs} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        currentUser={activeUser}
        onLogout={handleLogout}
        onReset={resetAllData}
        notifications={notifications}
        clearNotifications={() => setNotifications([])}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Mobile Sidebar backdrop blur overlay */}
        {isMobileSidebarOpen && (
          <div
            id="sidebar-mobile-overlay"
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <Sidebar
          userRole={activeUser.role}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false); // Clean up mobile drawer after click
          }}
          pendingApprovalsCount={
            plans.filter(
              (p) =>
                p.status === 'pending' &&
                allUsers.find((u) => u.id === p.teacherId)?.assignedOfficerId === activeUser.id
            ).length
          }
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              currentUser={activeUser}
              plans={plans}
              leaves={leaves}
              balances={balances}
              auditLogs={auditLogs}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'lesson-plans' && (
            <LessonPlans
              currentUser={activeUser}
              plans={plans}
              allUsers={allUsers}
              onSavePlan={handleSavePlan}
              onDeletePlan={handleDeletePlan}
              onSubmitPlan={handleSubmitPlanForReview}
              onPrintPreview={handlePrintPreviewTrigger}
            />
          )}

          {activeTab === 'approval-queue' && (
            <ApprovalQueue
              currentUser={activeUser}
              plans={plans}
              allUsers={allUsers}
              onApprove={handleApprovePlan}
              onReject={handleRejectPlan}
              onPrintPreview={handlePrintPreviewTrigger}
            />
          )}

          {activeTab === 'leave-requests' && (
            <LeaveRequestTab
              currentUser={activeUser}
              leaves={leaves}
              balances={balances}
              onSubmitLeave={handleLeaveSubmit}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              plans={plans}
              onSelectPlan={(p) => {
                setActiveTab('lesson-plans');
              }}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              plans={plans}
              leaves={leaves}
              allUsers={allUsers}
              onTriggerPrint={handleBulkPrintTrigger}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement
              currentUser={activeUser}
              allUsers={allUsers}
              onUpdateOfficerMapping={handleUpdateOfficerMapping}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogs
              logs={auditLogs}
              onClearLogs={() => setAuditLogs([])}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              currentUser={activeUser}
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onTriggerCleanup={handleTriggerCleanup}
            />
          )}
        </main>
      </div>

      {printTargetPlan && (
        <PrintPreview
          plan={printTargetPlan}
          versionNo={printTargetVersion}
          allUsers={allUsers}
          onClose={() => {
            setPrintTargetPlan(null);
            setPrintTargetVersion(undefined);
          }}
        />
      )}
    </div>
  );
}
