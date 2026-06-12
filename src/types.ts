export type Role =
  | 'Super Administrator'
  | 'Principal'
  | 'Deputy Principal'
  | 'Sectional Head'
  | 'Head of Department'
  | 'Teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar?: string;
  assignedOfficerId?: string; // Principal assigns this officer (Principal, Deputy Principal, Sectional Head, HOD)
}

export type LessonPlanStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface DailyNotes {
  competency: string;
  competencyLevel: string;
  aims: string;
  methodology: string; // e.g. Problem-Based, Flipped, Direct
  approachNotes: string; // Rich-text or string description
  approachTimeMinutes: number;
  proceduralActivities: ProceduralActivity[];
  evaluation: string;
  reflections: string;
}

export interface ProceduralActivity {
  seq: number;
  description: string;
  duration: string; // e.g., "10 mins"
  entity: 'Teacher' | 'Student' | 'Group';
}

export interface WeeklyNotes {
  weekStart: string; // YYYY-MM-DD
  theme: string;
  objectives: string;
  materials: string;
  highlights: string;
  assessments: string;
}

export interface UnitNotes {
  unitTitle: string;
  unitObjectives: string;
  topics: string;
  resources: string;
  assessmentPlan: string;
}

export interface LessonPlanVersion {
  id: string;
  planId: string;
  versionNo: string; // e.g., "1.0", "2.1", etc.
  title: string;
  status: LessonPlanStatus;
  remarks?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedByDesignation?: string;
  approvedAt?: string;
  dailyNotes: DailyNotes;
  weeklyNotes: WeeklyNotes;
  unitNotes: UnitNotes;
  createdAt: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  classSection: string;
  date: string; // Manual assignment
  status: LessonPlanStatus;
  createdAt: string;
  lastModified: string;
  currentVersionNo: string;
  versions: LessonPlanVersion[];
}

export interface ApprovalLog {
  id: string;
  planId: string;
  versionNo: string;
  officerId: string;
  officerName: string;
  officerDesignation: string;
  action: 'submit' | 'approve' | 'reject';
  remarks: string;
  timestamp: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Professional Development' | 'Emergency';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  remarks?: string;
  attachmentName?: string;
  createdAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedByDesignation?: string;
  approvedAt?: string;
}

export interface LeaveBalance {
  Annual: number;
  Sick: number;
  Casual: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string; // e.g. "User Login", "Create Record", "Approve Record", "System Configuration Changes"
  entity: string; // e.g. "Lesson Plan", "Leave Request", "System Settings", "User"
  entityId: string;
  details: string;
  status: 'SUCCESS' | 'BLOCKED' | 'WARNING';
}

export interface SystemSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smsGateway: string;
  smsApiKey: string;
  maxUploadSizeMB: number;
  allowedTypes: string; // e.g. "PDF, JPG, PNG, DOCX"
  retentionYears: number; // default is 3
}
