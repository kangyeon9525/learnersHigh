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
  FocusMonitorState,
  Goal,
  GrowthState,
  Milestone,
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
