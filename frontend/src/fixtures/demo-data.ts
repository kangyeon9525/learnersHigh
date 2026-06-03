/**
 * P1 UI 셸 전용 목 데이터 (fixture).
 *
 * 백엔드/MongoDB 없이도 전체 화면을 눌러볼 수 있도록 시드 스냅샷 형태로 제공한다.
 * 서버 응답과 동일한 `shared/types` 형태를 유지하므로 P2/P3에서 실제 API 응답으로
 * 교체할 때 컴포넌트 수정이 필요 없다.
 *
 * TODO(P2.1/P3.5): plans·attendance·dailyReport는 실제 API(`/api/plans`,
 * `/api/attendance`, `/api/reports/daily`) 응답으로 대체한다.
 */
import type {
  AttendanceRecord,
  BranchRanking,
  FocusMonitorState,
  Goal,
  GrowthState,
  LibraryItem,
  Milestone,
  MonthlyReport,
  StudyPlan,
  StudySessionResult,
  User,
} from '@learners-high/shared';

export const demoUser: User = {
  id: 'demo-user',
  displayName: '민수',
  branchId: 'gangnam',
};

export const demoGrowth: GrowthState = {
  id: 'growth-demo',
  userId: demoUser.id,
  lifetime: {
    totalScore: 720,
    currentStage: 3,
    history: [
      { date: '2024-05-20', scoreDelta: 60, stage: 2 },
      { date: '2024-05-22', scoreDelta: 90, stage: 3 },
      { date: '2024-05-24', scoreDelta: 150, stage: 3 },
    ],
  },
  monthly: {
    currentMonth: '2024-05',
    totalScore: 210,
    currentStage: 3,
    archive: [
      { month: '2024-01', totalScore: 140, finalStage: 2 },
      { month: '2024-02', totalScore: 180, finalStage: 2 },
      { month: '2024-03', totalScore: 240, finalStage: 3 },
      { month: '2024-04', totalScore: 300, finalStage: 4 },
    ],
  },
};

export const demoMilestones: Milestone[] = [
  {
    id: 'm-early-bird',
    userId: demoUser.id,
    title: '얼리버드',
    conditionCode: 'STREAK_MORNING_10',
    rewardScore: 250,
    isAchieved: true,
    achievedAt: '2023-10-12T07:00:00.000Z',
  },
  {
    id: 'm-perfect-week',
    userId: demoUser.id,
    title: '완벽한 한 주',
    conditionCode: 'WEEKLY_GOAL_FULL',
    rewardScore: 200,
    isAchieved: true,
    achievedAt: '2023-11-05T21:00:00.000Z',
  },
  {
    id: 'm-math-master',
    userId: demoUser.id,
    title: '수학 마스터',
    conditionCode: 'SUBJECT_MATH_20H',
    rewardScore: 300,
    isAchieved: true,
    achievedAt: '2023-11-15T18:00:00.000Z',
  },
  {
    id: 'm-note-taker',
    userId: demoUser.id,
    title: '필기왕',
    conditionCode: 'NOTES_50',
    rewardScore: 120,
    isAchieved: true,
    achievedAt: '2023-12-01T18:00:00.000Z',
  },
  {
    id: 'm-library-owl',
    userId: demoUser.id,
    title: '도서관 부엉이',
    conditionCode: 'READ_50_CHAPTERS',
    rewardScore: 150,
    isAchieved: false,
  },
  {
    id: 'm-study-buddy',
    userId: demoUser.id,
    title: '스터디 메이트',
    conditionCode: 'GROUP_SESSION_10',
    rewardScore: 150,
    isAchieved: false,
  },
  {
    id: 'm-deep-focus',
    userId: demoUser.id,
    title: '딥 포커스',
    conditionCode: 'FOCUS_5H_CONT',
    rewardScore: 200,
    isAchieved: false,
  },
  {
    id: 'm-concept-king',
    userId: demoUser.id,
    title: '개념 정복',
    conditionCode: 'CORE_CONCEPTS_12',
    rewardScore: 300,
    isAchieved: false,
  },
];

export const demoGoals: Goal[] = [
  {
    id: 'g-daily-focus',
    userId: demoUser.id,
    cycle: 'daily',
    targetValue: 180,
    currentValue: 132,
    rewardScore: 50,
    isCompleted: false,
  },
  {
    id: 'g-daily-subjects',
    userId: demoUser.id,
    cycle: 'daily',
    targetValue: 120,
    currentValue: 60,
    rewardScore: 40,
    isCompleted: false,
  },
  {
    id: 'g-weekly-goal',
    userId: demoUser.id,
    cycle: 'weekly',
    targetValue: 900,
    currentValue: 900,
    rewardScore: 120,
    isCompleted: true,
  },
];

export const demoPlans: StudyPlan[] = [
  {
    id: 'p-math',
    userId: demoUser.id,
    title: '수학 · 4장 미적분',
    plannedDate: '2024-05-24',
    sortOrder: 0,
    durationMinutes: 90,
    completed: true,
  },
  {
    id: 'p-english',
    userId: demoUser.id,
    title: '영어 · 에세이 쓰기 연습',
    plannedDate: '2024-05-24',
    sortOrder: 1,
    durationMinutes: 45,
    completed: false,
  },
  {
    id: 'p-science',
    userId: demoUser.id,
    title: '과학 · 세포 생물학 복습',
    plannedDate: '2024-05-24',
    sortOrder: 2,
    durationMinutes: 60,
    completed: false,
  },
];

export const demoFocusMonitor: FocusMonitorState = {
  active: true,
  displayMode: 'standby',
  status: 'focus',
  frame: {
    id: 'focus-desk-1',
    status: 'focus',
    imageUrl: '/focus-monitor/focus-desk.svg',
    label: '책상에 앉아 학습 중',
  },
  monitoringSince: '2024-05-24T09:00:00.000Z',
  isRecording: false,
  attendanceId: 'att-demo',
};

export const demoAttendance: AttendanceRecord = {
  id: 'att-demo',
  userId: demoUser.id,
  checkInAt: '2024-05-24T09:00:00.000Z',
  status: 'checked_in',
  focusMonitoring: {
    enabled: true,
    currentStatus: 'focus',
    currentFrameId: 'focus-desk-1',
    startedAt: '2024-05-24T09:00:00.000Z',
  },
};

/** fixture 모드: 이탈 시뮬레이션용 프레임 */
export const demoFocusMonitorDistracted: FocusMonitorState = {
  ...demoFocusMonitor,
  displayMode: 'live',
  status: 'distracted',
  frame: {
    id: 'distracted-phone-1',
    status: 'distracted',
    imageUrl: '/focus-monitor/distracted-phone.svg',
    label: '시선이 화면에서 벗어남',
  },
};

/** 학습 종료 정산 모달 fixture (Storybook·UI 시연용) */
const settlementBase: StudySessionResult = {
  sessionId: 'session-demo',
  focusMinutes: 45,
  earnedScore: 80,
  newMilestones: [],
  completedGoals: [],
  growthDelta: {
    lifetime: { fromStage: 1, toStage: 1 },
    monthly: { fromStage: 0, toStage: 1 },
  },
};

/** P1.5.4 — 정산 모달 4변형 fixture */
export const demoSettlementVariants = {
  empty: { ...settlementBase, earnedScore: 40 },
  milestonesOnly: {
    ...settlementBase,
    earnedScore: 150,
    newMilestones: [demoMilestones[0]],
  },
  questsOnly: {
    ...settlementBase,
    earnedScore: 120,
    completedGoals: [demoGoals[2]],
  },
  combined: {
    sessionId: 'session-demo',
    focusMinutes: 195,
    earnedScore: 370,
    newMilestones: [demoMilestones[0]],
    completedGoals: [demoGoals[2]],
    growthDelta: {
      lifetime: { fromStage: 2, toStage: 3 },
      monthly: { fromStage: 2, toStage: 3 },
    },
  },
};

export const demoSettlement: StudySessionResult = {
  ...demoSettlementVariants.combined,
  newMilestones: [...demoSettlementVariants.combined.newMilestones],
  completedGoals: [...demoSettlementVariants.combined.completedGoals],
};

/** 데일리 리포트 화면 전용 view-model (백엔드 aggregation 전까지 UI 셸용) */
export interface DailyReportTimelineEntry {
  kind: 'check' | 'study';
  time: string;
  title: string;
  subtitle?: string;
  durationLabel?: string;
  rating?: number;
}

export interface DailyReportSubject {
  label: string;
  ratio: number;
  color: string;
}

export interface DailyReportView {
  date: string;
  dateLabel: string;
  timeline: DailyReportTimelineEntry[];
  totalFocusLabel: string;
  subjects: DailyReportSubject[];
  focusEfficiency: number;
  achievedBadgeCount: number;
  comment: string;
  growthComment: string;
}

export const demoDailyReport: DailyReportView = {
  date: '2024-05-24',
  dateLabel: '2024년 5월 24일 금요일',
  timeline: [
    { kind: 'check', time: '오전 9:00', title: '입실' },
    {
      kind: 'study',
      time: '09:15 - 10:45',
      title: '수학',
      subtitle: '확률과 통계',
      durationLabel: '1시간 30분',
      rating: 5,
    },
    {
      kind: 'study',
      time: '11:00 - 11:45',
      title: '영어',
      subtitle: '어휘 연습',
      durationLabel: '45분',
      rating: 4,
    },
    {
      kind: 'study',
      time: '13:30 - 14:30',
      title: '과학',
      subtitle: '열역학',
      durationLabel: '1시간',
      rating: 5,
    },
    { kind: 'check', time: '오후 3:30', title: '퇴실' },
  ],
  totalFocusLabel: '3시간 15분',
  subjects: [
    { label: '수학', ratio: 45, color: '#8b5cf6' },
    { label: '영어', ratio: 25, color: '#22c55e' },
    { label: '과학', ratio: 30, color: '#eab308' },
  ],
  focusEfficiency: 82,
  achievedBadgeCount: 3,
  comment:
    '"수학 통계 파트가 조금 어려웠지만 포기하지 않고 끝까지 풀었다. 내일은 영어 단어를 좀 더 집중적으로 봐야지!"',
  growthComment: '성실한 학습 덕분에 정원의 나무가 12cm 더 자랐습니다.',
};

// 월간 리포트 fixture — 리얼리스틱 22일 활동 데이터 (2024-05)
const _monthlyDays = [
  { date: '2024-05-02', focusMinutes: 45, sessionCount: 1, earnedScore: 90 },
  { date: '2024-05-03', focusMinutes: 110, sessionCount: 2, earnedScore: 220 },
  { date: '2024-05-06', focusMinutes: 75, sessionCount: 2, earnedScore: 150 },
  { date: '2024-05-07', focusMinutes: 130, sessionCount: 3, earnedScore: 260 },
  { date: '2024-05-08', focusMinutes: 90, sessionCount: 2, earnedScore: 180 },
  { date: '2024-05-09', focusMinutes: 55, sessionCount: 1, earnedScore: 110 },
  { date: '2024-05-10', focusMinutes: 145, sessionCount: 3, earnedScore: 290 },
  { date: '2024-05-13', focusMinutes: 30, sessionCount: 1, earnedScore: 60 },
  { date: '2024-05-14', focusMinutes: 120, sessionCount: 2, earnedScore: 240 },
  { date: '2024-05-15', focusMinutes: 165, sessionCount: 3, earnedScore: 330 },
  { date: '2024-05-16', focusMinutes: 85, sessionCount: 2, earnedScore: 170 },
  { date: '2024-05-17', focusMinutes: 100, sessionCount: 2, earnedScore: 200 },
  { date: '2024-05-20', focusMinutes: 60, sessionCount: 1, earnedScore: 120 },
  { date: '2024-05-21', focusMinutes: 140, sessionCount: 3, earnedScore: 280 },
  { date: '2024-05-22', focusMinutes: 175, sessionCount: 3, earnedScore: 350 },
  { date: '2024-05-23', focusMinutes: 95, sessionCount: 2, earnedScore: 190 },
  { date: '2024-05-24', focusMinutes: 195, sessionCount: 4, earnedScore: 390 },
  { date: '2024-05-27', focusMinutes: 50, sessionCount: 1, earnedScore: 100 },
  { date: '2024-05-28', focusMinutes: 115, sessionCount: 2, earnedScore: 230 },
  { date: '2024-05-29', focusMinutes: 130, sessionCount: 3, earnedScore: 260 },
  { date: '2024-05-30', focusMinutes: 80, sessionCount: 2, earnedScore: 160 },
  { date: '2024-05-31', focusMinutes: 155, sessionCount: 3, earnedScore: 310 },
];
const _totalFocus = _monthlyDays.reduce((s, d) => s + d.focusMinutes, 0);
const _totalScore = _monthlyDays.reduce((s, d) => s + d.earnedScore, 0);
const _totalSessions = _monthlyDays.reduce((s, d) => s + d.sessionCount, 0);

/** P4.3: 라이브러리 fixture 데이터 */
export const demoLibraryItems: LibraryItem[] = [
  // 학습 자료
  { id: 'lib-s1', title: '수학 필수 공식 총정리', category: 'study', description: '수I·수II·미적분·확통 핵심 공식 요약집', tags: ['수학', '공식', '요약'] },
  { id: 'lib-s2', title: '영어 어휘 2000 리스트', category: 'study', description: '수능 필수 어휘 빈출 2000단어 정리', tags: ['영어', '어휘', '수능'] },
  { id: 'lib-s3', title: '과학 개념 요약 (물·화·생·지)', category: 'study', description: '물리·화학·생물·지구과학 핵심 개념 카드', tags: ['과학', '개념', '요약'] },
  { id: 'lib-s4', title: '역사 연표 타임라인', category: 'study', description: '한국사·세계사 주요 사건 연대기 정리', tags: ['역사', '연표', '한국사'] },
  { id: 'lib-s5', title: '국어 문법 핵심 정리', category: 'study', description: '형태소, 통사론, 담화 등 문법 개념 정리', tags: ['국어', '문법'] },
  { id: 'lib-s6', title: '수학 기출 문제 모음', category: 'study', description: '최근 3년 수능·모의고사 수학 기출', tags: ['수학', '기출', '모의고사'] },
  // 수업
  { id: 'lib-c1', title: '수학 기초반 — 6월 강의', category: 'class', description: '매주 월·수 10:00 | 기초 개념 완성 중심', tags: ['수학', '기초', '수업'] },
  { id: 'lib-c2', title: '영어 심화 독해반', category: 'class', description: '매주 화·목 14:00 | 장문 독해·어법 집중', tags: ['영어', '독해', '심화'] },
  { id: 'lib-c3', title: '과학탐구 선택 특강', category: 'class', description: '매주 금 16:00 | 물리1·화학1·생물1 분반', tags: ['과학', '탐구', '특강'] },
  { id: 'lib-c4', title: '국어 문학·비문학 특강', category: 'class', description: '격주 토 09:00 | 현대시·소설 집중 분석', tags: ['국어', '문학', '특강'] },
  // 생활
  { id: 'lib-l1', title: '6월 식단 안내', category: 'life', description: '이번 달 점심·저녁 메뉴 및 알레르기 정보', tags: ['식단', '급식'] },
  { id: 'lib-l2', title: '자습실 이용 규칙', category: 'life', description: '조용한 학습 환경 유지를 위한 자습실 이용 안내', tags: ['시설', '자습실'] },
  { id: 'lib-l3', title: '도서관 신착 도서 목록', category: 'life', description: '5~6월 신착 참고서 및 교양 도서 안내', tags: ['도서관', '도서'] },
  { id: 'lib-l4', title: '건강 관리 & 스트레칭 가이드', category: 'life', description: '장시간 학습 중 건강 유지 스트레칭 루틴', tags: ['건강', '스트레칭'] },
];

/** P4.3: 지점 가상 순위 fixture */
export const demoBranchRanking: BranchRanking = {
  branchId: 'gangnam',
  month: '2024-05',
  currentUserRank: 3,
  entries: [
    { rank: 1, userId: 'u-achiever', displayName: '박성실', monthlyScore: 420, currentStage: 4, isCurrentUser: false },
    { rank: 2, userId: 'u-diligent', displayName: '이노력', monthlyScore: 310, currentStage: 3, isCurrentUser: false },
    { rank: 3, userId: 'demo-user', displayName: '민수', monthlyScore: 210, currentStage: 3, isCurrentUser: true },
    { rank: 4, userId: 'u-steady', displayName: '최꾸준', monthlyScore: 180, currentStage: 2, isCurrentUser: false },
    { rank: 5, userId: 'u-starter', displayName: '김시작', monthlyScore: 120, currentStage: 2, isCurrentUser: false },
    { rank: 6, userId: 'u-learning', displayName: '정학습', monthlyScore: 90, currentStage: 1, isCurrentUser: false },
    { rank: 7, userId: 'u-new', displayName: '오새싹', monthlyScore: 60, currentStage: 1, isCurrentUser: false },
  ],
};

/** P4.3: 코칭 클래스 fixture */
export const demoCoaches = [
  { id: 'coach-1', name: '김민준 코치', specialty: '수학 전문', bio: '10년 경력 수학 전문 코치. 개념 이해와 응용력 향상 집중.', availableSlots: ['2026-06-04 09:00', '2026-06-04 11:00', '2026-06-06 14:00'] },
  { id: 'coach-2', name: '이수진 코치', specialty: '영어 전문', bio: '원어민 수준 영어 지도. 독해·문법·어휘 종합 관리.', availableSlots: ['2026-06-05 10:00', '2026-06-05 16:00', '2026-06-07 11:00'] },
  { id: 'coach-3', name: '박지성 코치', specialty: '학습 전략', bio: '학습법 전문 코치. 시간 관리·계획 수립·동기 부여.', availableSlots: ['2026-06-04 14:00', '2026-06-06 10:00', '2026-06-07 16:00'] },
] as const;

export const demoMonthlyReport: MonthlyReport = {
  month: '2024-05',
  userId: 'demo-user',
  totalFocusMinutes: _totalFocus,
  totalSessions: _totalSessions,
  totalEarnedScore: _totalScore,
  avgFocusMinutesPerDay: Math.round(_totalFocus / _monthlyDays.length),
  activeDays: _monthlyDays.length,
  focusEfficiency: 78,
  days: _monthlyDays,
  growthArchive: { totalScore: _totalScore, finalStage: 3 },
};
