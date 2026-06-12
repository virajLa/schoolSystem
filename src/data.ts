import { User, LessonPlan, LeaveRequest, AuditLog, SystemSettings, LeaveBalance } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@schoolflow.edu',
    role: 'Teacher',
    department: 'Science',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    assignedOfficerId: 'u4', // Head of Department (James Carter)
  },
  {
    id: 'u2',
    name: 'David Miller',
    email: 'david.miller@schoolflow.edu',
    role: 'Teacher',
    department: 'Mathematics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    assignedOfficerId: 'u3', // Deputy Principal (Eleanor Vance)
  },
  {
    id: 'u3',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@schoolflow.edu',
    role: 'Deputy Principal',
    department: 'Administration',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    id: 'u4',
    name: 'James Carter',
    email: 'james.carter@schoolflow.edu',
    role: 'Head of Department',
    department: 'Science',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'u5',
    name: 'Dr. Arthur Winston',
    email: 'arthur.winston@schoolflow.edu',
    role: 'Principal',
    department: 'Administration',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    id: 'u6',
    name: 'Marcus Brody',
    email: 'marcus.brody@schoolflow.edu',
    role: 'Super Administrator',
    department: 'IT',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
  },
  {
    id: 'u7',
    name: 'Clara Oswald',
    role: 'Sectional Head',
    email: 'clara.oswald@schoolflow.edu',
    department: 'Junior School',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
];

export const INITIAL_LEAVE_BALANCES: Record<string, LeaveBalance> = {
  u1: { Annual: 14, Sick: 8, Casual: 5 },
  u2: { Annual: 12, Sick: 10, Casual: 7 },
  u3: { Annual: 20, Sick: 15, Casual: 10 },
  u4: { Annual: 18, Sick: 12, Casual: 8 },
};

export const INITIAL_SETTINGS: SystemSettings = {
  smtpHost: 'smtp.schoolflow.edu',
  smtpPort: '587',
  smtpUser: 'no-reply@schoolflow.edu',
  smsGateway: 'Ceyora SMS API Gateway',
  smsApiKey: 'cey_sk_8f2a93b41cd99e32ff721aee',
  maxUploadSizeMB: 10,
  allowedTypes: 'PDF, JPG, PNG, DOCX',
  retentionYears: 3,
};

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-1',
    title: 'Cell Division: Mitosis & Meiosis Processes',
    teacherId: 'u1',
    teacherName: 'Sarah Jenkins',
    subject: 'Biology',
    grade: 'Grade 10',
    classSection: 'Class A',
    date: '2026-06-15',
    status: 'approved',
    createdAt: '2026-06-08T08:30:00Z',
    lastModified: '2026-06-08T10:45:00Z',
    currentVersionNo: '1.0',
    versions: [
      {
        id: 'lpv-1a',
        planId: 'lp-1',
        versionNo: '1.0',
        title: 'Cell Division: Mitosis & Meiosis Processes',
        status: 'approved',
        approvedBy: 'u4',
        approvedByName: 'James Carter',
        approvedByDesignation: 'Head of Department',
        approvedAt: '2026-06-09T09:15:00Z',
        dailyNotes: {
          competency: 'Analyze cell multiplication mechanisms and structural variation',
          competencyLevel: 'Advanced Understanding (Level 4)',
          aims: 'Engage students in hands-on building of biological phase models using creative physical matrices.',
          methodology: 'Problem-Based Learning',
          approachNotes: 'Conduct direct cellular microscopic observations, then split into groups of three for modeling key mitotic transitions.',
          approachTimeMinutes: 45,
          proceduralActivities: [
            { seq: 1, description: 'Microscope warm-up and slide setups', duration: '10 mins', entity: 'Teacher' },
            { seq: 2, description: 'Identifying chromatid separation on specimen structures', duration: '20 mins', entity: 'Student' },
            { seq: 3, description: 'Collaborative analysis and active summary drawings', duration: '15 mins', entity: 'Group' }
          ],
          evaluation: 'Individual quizzes testing stages sequencing accuracy plus structural descriptions.',
          reflections: 'The tangible clay models significantly resolved prior misconceptions about chromosomal alignment in metaphase.'
        },
        weeklyNotes: {
          weekStart: '2026-06-15',
          theme: 'Structure and Function of Organisms',
          objectives: 'Distinguish cellular division phases, clarify nuclear membrane disintegration timing, and express diploid counts in mathematical ratios.',
          materials: 'Premade biological slides, compound light microscopes, colorful modeling clay, phase chart schematics.',
          highlights: 'Interactive slide identification challenge.',
          assessments: 'Weekly micrographic quiz and conceptual model diagrams.'
        },
        unitNotes: {
          unitTitle: 'Unit 3: Cellular Regeneration and Hereditary Transmission',
          unitObjectives: 'Formulate explanations for replication fidelity, analyze tissue repair rates in complex hosts, and calculate gene delivery scenarios.',
          topics: 'Mitosis, Meiosis, Chromatin condensation, Spindle fibers function, Cytokinesis pathways.',
          resources: 'Standard Biology Volume II, Medical Cell Biology Digital Slides, YouTube Cell Division 3D Rendering.',
          assessmentPlan: 'Post-Unit cell culture written report and 50-question diagnostic exam.'
        },
        createdAt: '2026-06-08T08:30:00Z'
      }
    ]
  },
  {
    id: 'lp-2',
    title: 'Linear Inequalities & Graphic Intercom Matrices',
    teacherId: 'u2',
    teacherName: 'David Miller',
    subject: 'Mathematics',
    grade: 'Grade 11',
    classSection: 'Class B',
    date: '2026-06-16',
    status: 'pending',
    createdAt: '2026-06-10T14:10:00Z',
    lastModified: '2026-06-10T15:20:00Z',
    currentVersionNo: '1.0',
    versions: [
      {
        id: 'lpv-2a',
        planId: 'lp-2',
        versionNo: '1.0',
        title: 'Linear Inequalities & Graphic Intercom Matrices',
        status: 'pending',
        dailyNotes: {
          competency: 'Solve and bound multi-variable linear algebraic limits',
          competencyLevel: 'Operational Fluency (Level 3)',
          aims: 'Equip pupils to translate regional constraint parameters into coordinate boundaries.',
          methodology: 'Flipped Classroom',
          approachNotes: 'Review the pre-class video questions, demonstrate overlapping regional shadings on the board, and assign cooperative plotting challenge.',
          approachTimeMinutes: 50,
          proceduralActivities: [
            { seq: 1, description: 'Direct reviews of digital pre-class homework answers', duration: '10 mins', entity: 'Teacher' },
            { seq: 2, description: 'Interactive charting of constraint systems with color-coded highlighters', duration: '20 mins', entity: 'Student' },
            { seq: 3, description: 'Peer evaluation of coordinate region checks', duration: '20 mins', entity: 'Group' }
          ],
          evaluation: 'Pair-wise check-points of vertex computations.',
          reflections: ''
        },
        weeklyNotes: {
          weekStart: '2026-06-15',
          theme: 'Analytical Geometry and Algebraic Coordinate Mapping',
          objectives: 'Delineate shaded half-planes, describe strict versus non-strict inequality representations, and extract equations from situational stories.',
          materials: 'Grid whiteboards, color fine-tip markers, graph paper packages, projection coordinate slides.',
          highlights: 'Optimal cost boundary mapping exercise.',
          assessments: 'Graph compliance checklist and written algebraic exercises.'
        },
        unitNotes: {
          unitTitle: 'Unit 4: Systems of Interlocking Constraints and Linear Planning',
          unitObjectives: 'Synthesize optimal solution intersections, define bounding definitions, and process three-variable matrix constraints.',
          topics: 'Inequality signs, Shading directions, Feasible regions, Corner-point theorem applications.',
          resources: 'Aha! Mathematics Curriculum Guide, GeoGebra online coordinate systems graphing application.',
          assessmentPlan: 'Design plan presentation for resource optimization and comprehensive standard calculus-readiness test.'
        },
        createdAt: '2026-06-10T14:10:00Z'
      }
    ]
  },
  {
    id: 'lp-3',
    title: 'Photosynthesis Rate under Wavelength Extremes',
    teacherId: 'u1',
    teacherName: 'Sarah Jenkins',
    subject: 'Biology',
    grade: 'Grade 10',
    classSection: 'Class C',
    date: '2026-06-18',
    status: 'draft',
    createdAt: '2026-06-11T09:00:00Z',
    lastModified: '2026-06-11T09:40:00Z',
    currentVersionNo: '0.1',
    versions: [
      {
        id: 'lpv-3a',
        planId: 'lp-3',
        versionNo: '0.1',
        title: 'Photosynthesis Rate under Wavelength Extremes',
        status: 'draft',
        dailyNotes: {
          competency: 'Deduce biochemical activity from physical spectrum data',
          competencyLevel: 'Analytical Thinking (Level 3)',
          aims: 'Empirically verify oxygen gas formation rates inside varying light spectra.',
          methodology: 'Experimental Discovery',
          approachNotes: 'Position Elodea sprigs inside test chambers exposed to blue, green, and red light filters. Track and tally bubbling rates.',
          approachTimeMinutes: 60,
          proceduralActivities: [
            { seq: 1, description: 'Setting up colored gel filter arrays and light lamps', duration: '15 mins', entity: 'Teacher' },
            { seq: 2, description: 'Recording time intervals and gas release bubble indices', duration: '30 mins', entity: 'Student' },
            { seq: 3, description: 'Aggregating class findings into a singular unified line graph', duration: '15 mins', entity: 'Group' }
          ],
          evaluation: 'A critical review of the structural experiment reports and mathematical interpretation of green-colored filtering.',
          reflections: ''
        },
        weeklyNotes: {
          weekStart: '2026-06-15',
          theme: 'Plants Energetics and Biochemical Synthesizers',
          objectives: 'Examine thylakoid reactions, explain standard chlorophyll Absorption Spectra models, and identify light reactions variables.',
          materials: 'Aquatic Elodea plants, test tubes, sodium bicarbonate solutions, clear color plastic sheets.',
          highlights: 'Elodea cellular bubbling simulation project.',
          assessments: 'Laboratory report grading sheet.'
        },
        unitNotes: {
          unitTitle: 'Unit 3: Cellular Regeneration and Hereditary Transmission',
          unitObjectives: 'Deconstruct carbon assimilation pathways, evaluate enzyme limits, and trace cellular energy pathways.',
          topics: 'Chloroplast structure, Light-dependent reactions, Calvin Cycle cycles, Carbon fixation factors.',
          resources: 'Biophysical Journal Archives, Lab Manual Series 11.',
          assessmentPlan: 'Research report and biochemical lab presentation.'
        },
        createdAt: '2026-06-11T09:00:00Z'
      }
    ]
  },
  {
    id: 'lp-4',
    title: 'Atomic Fusion and Nuclear Radiations Overview',
    teacherId: 'u1',
    teacherName: 'Sarah Jenkins',
    subject: 'Physics',
    grade: 'Grade 12',
    classSection: 'Class A',
    date: '2026-06-19',
    status: 'rejected',
    createdAt: '2026-06-05T11:00:00Z',
    lastModified: '2026-06-06T15:30:00Z',
    currentVersionNo: '1.0',
    versions: [
      {
        id: 'lpv-4a',
        planId: 'lp-4',
        versionNo: '1.0',
        title: 'Atomic Fusion and Nuclear Radiations Overview',
        status: 'rejected',
        remarks: 'The procedural experiments represent critical radiation risks for student handling. Please substitute with safety simulations.',
        approvedBy: 'u4',
        approvedByName: 'James Carter',
        approvedByDesignation: 'Head of Department',
        approvedAt: '2026-06-06T16:00:00Z',
        dailyNotes: {
          competency: 'Outline isotopic transformations and decay parameters',
          competencyLevel: 'Advanced Understanding (Level 4)',
          aims: 'Illustrate cloud chamber particle track patterns using dynamic digital modules.',
          methodology: 'Direct Instruction',
          approachNotes: 'Deliver a presentation clarifying alpha, beta, and gamma properties. Transition to radioactive simulator software.',
          approachTimeMinutes: 45,
          proceduralActivities: [
            { seq: 1, description: 'Lecture on decay mechanisms, emission paths, and shielding limits', duration: '15 mins', entity: 'Teacher' },
            { seq: 2, description: 'Calculating isotope half-life equations from reference sheets', duration: '15 mins', entity: 'Student' },
            { seq: 3, description: 'Virtual decay simulation exploration on lab laptops', duration: '15 mins', entity: 'Group' }
          ],
          evaluation: 'Formative worksheet with five decay equations.',
          reflections: ''
        },
        weeklyNotes: {
          weekStart: '2026-06-08',
          theme: 'Nuclear Physics Foundations',
          objectives: 'Write nuclear decay equations, compare ionization charges, and solve decay-time curves.',
          materials: 'Decay virtual modeling software, periodic table, mass charts.',
          highlights: 'Virtual Geiger Counter audio mapping.',
          assessments: 'Decay equations review and analytical quiz.'
        },
        unitNotes: {
          unitTitle: 'Unit 5: Nuclear Structure and Particle Physics',
          unitObjectives: 'Formulate decay series matrices, evaluate modern reactor safety, and outline binding energy distributions.',
          topics: 'Isotopes, Alpha emission, Beta decay, Gamma rays, Cloud chambers.',
          resources: 'Advanced Physics Core, IAEA Educational Repository.',
          assessmentPlan: 'Reactor safety design project.'
        },
        createdAt: '2026-06-05T11:00:00Z'
      }
    ]
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lv-1',
    teacherId: 'u1',
    teacherName: 'Sarah Jenkins',
    department: 'Science',
    type: 'Sick',
    startDate: '2026-06-22',
    endDate: '2026-06-24',
    reason: 'Dental appointment and root canal therapy follow-up.',
    status: 'approved',
    attachmentName: 'dental_certificate.pdf',
    createdAt: '2026-06-05T09:00:00Z',
    approvedBy: 'u5',
    approvedByName: 'Dr. Arthur Winston',
    approvedByDesignation: 'Principal',
    approvedAt: '2026-06-05T14:30:00Z',
  },
  {
    id: 'lv-2',
    teacherId: 'u2',
    teacherName: 'David Miller',
    department: 'Mathematics',
    type: 'Annual',
    startDate: '2026-07-10',
    endDate: '2026-07-15',
    reason: 'Family wedding abroad. Ticket confirmations have been uploaded.',
    status: 'pending',
    attachmentName: 'wedding_invitation.pdf',
    createdAt: '2026-06-11T11:15:00Z',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-06-11T08:00:00Z',
    userId: 'u6',
    userName: 'Marcus Brody',
    userRole: 'Super Administrator',
    action: 'User Login',
    entity: 'System Session',
    entityId: 'u6',
    details: 'Logged in from administrator terminal terminal-A',
    status: 'SUCCESS'
  },
  {
    id: 'aud-2',
    timestamp: '2026-06-11T09:20:00Z',
    userId: 'u1',
    userName: 'Sarah Jenkins',
    userRole: 'Teacher',
    action: 'Create Record',
    entity: 'Lesson Plan',
    entityId: 'lp-3',
    details: 'Initiated draft for lesson plan: Photosynthesis Rate under Wavelength Extremes',
    status: 'SUCCESS'
  },
  {
    id: 'aud-3',
    timestamp: '2026-06-09T09:15:00Z',
    userId: 'u4',
    userName: 'James Carter',
    userRole: 'Head of Department',
    action: 'Approve Record',
    entity: 'Lesson Plan',
    entityId: 'lp-1',
    details: 'Approved Mitosis & Meiosis (Version 1.0) with satisfactory remarks',
    status: 'SUCCESS'
  },
  {
    id: 'aud-4',
    timestamp: '2026-06-06T16:00:00Z',
    userId: 'u4',
    userName: 'James Carter',
    userRole: 'Head of Department',
    action: 'Reject Record',
    entity: 'Lesson Plan',
    entityId: 'lp-4',
    details: 'Rejected Atomic Fusion (Version 1.0) citing mandatory procedural risk remarks',
    status: 'SUCCESS'
  },
  {
    id: 'aud-5',
    timestamp: '2026-06-05T14:30:00Z',
    userId: 'u5',
    userName: 'Dr. Arthur Winston',
    userRole: 'Principal',
    action: 'Approve Record',
    entity: 'Leave Request',
    entityId: 'lv-1',
    details: 'Approved Sick Leave for Sarah Jenkins (Dental operation)',
    status: 'SUCCESS'
  }
];

// Helper to initialize Local Storage
export function initializeStorage() {
  if (!localStorage.getItem('sf_users')) {
    localStorage.setItem('sf_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('sf_balances')) {
    localStorage.setItem('sf_balances', JSON.stringify(INITIAL_LEAVE_BALANCES));
  }
  if (!localStorage.getItem('sf_settings')) {
    localStorage.setItem('sf_settings', JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem('sf_plans')) {
    localStorage.setItem('sf_plans', JSON.stringify(INITIAL_LESSON_PLANS));
  }
  if (!localStorage.getItem('sf_leaves')) {
    localStorage.setItem('sf_leaves', JSON.stringify(INITIAL_LEAVE_REQUESTS));
  }
  if (!localStorage.getItem('sf_audit')) {
    localStorage.setItem('sf_audit', JSON.stringify(INITIAL_AUDIT_LOGS));
  }
}

export function resetAllData() {
  localStorage.removeItem('sf_users');
  localStorage.removeItem('sf_balances');
  localStorage.removeItem('sf_settings');
  localStorage.removeItem('sf_plans');
  localStorage.removeItem('sf_leaves');
  localStorage.removeItem('sf_audit');
  localStorage.removeItem('sf_active_user');
  initializeStorage();
  window.location.reload();
}
