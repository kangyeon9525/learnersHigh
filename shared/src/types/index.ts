/**
 * 공통 DTO — MongoDB 컬렉션(Mongoose) 및 API 응답에 사용
 * Collections: users, studySessions, milestones, goals, growthStates
 */

export type SatisfactionScore = 1 | 2 | 3 | 4 | 5;
export type GoalCycle = 'daily' | 'weekly' | 'monthly';
export type AiFocusStatus = 'focus' | 'distracted';

export interface AiEvent {
  at: string;
  status: AiFocusStatus;
}

export interface StudySession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string;
  focusMinutes: number;
  satisfaction: SatisfactionScore;
  /** 학습 종료 시 입력한 진척도 (1–5) */
  progress?: SatisfactionScore;
  /** mock-ai 연속 이탈 N회 이상 시 true (P2.3.2) */
  focusAlertTriggered?: boolean;
  completed: boolean;
  aiEvents: AiEvent[];
}

export interface Milestone {
  id: string;
  userId: string;
  title: string;
  conditionCode: string;
  rewardScore: number;
  isAchieved: boolean;
  achievedAt?: string;
}

export interface Goal {
  id: string;
  userId: string;
  cycle: GoalCycle;
  targetValue: number;
  currentValue: number;
  rewardScore: number;
  isCompleted: boolean;
}

export interface GrowthHistoryEntry {
  date: string;
  scoreDelta: number;
  stage: number;
}

export interface MonthlyArchiveEntry {
  month: string;
  totalScore: number;
  finalStage: number;
}

export interface GrowthState {
  id: string;
  userId: string;
  lifetime: {
    totalScore: number;
    currentStage: number;
    history: GrowthHistoryEntry[];
  };
  monthly: {
    currentMonth: string;
    totalScore: number;
    currentStage: number;
    archive: MonthlyArchiveEntry[];
  };
}

/** 학습 종료 정산 모달용 응답 DTO (DB 저장 X) */
export interface StudySessionResult {
  sessionId: string;
  focusMinutes: number;
  earnedScore: number;
  newMilestones: Milestone[];
  completedGoals: Goal[];
  growthDelta: {
    lifetime: { fromStage: number; toStage: number };
    monthly: { fromStage: number; toStage: number };
  };
}

export interface User {
  id: string;
  displayName: string;
  branchId: string;
}

export interface EndStudySessionRequest {
  userId: string;
  startedAt: string;
  endedAt: string;
  focusMinutes: number;
  satisfaction: SatisfactionScore;
  progress: SatisfactionScore;
  aiEvents?: AiEvent[];
}

export interface StartStudySessionRequest {
  userId: string;
  startedAt: string;
}

export interface InjectAiEventRequest {
  userId: string;
  sessionId?: string;
  status: AiFocusStatus;
}

export type AttendanceStatus = 'checked_in' | 'checked_out';
export type CheckOutPurpose = 'continue_study' | 'break' | 'home' | 'other';

/** 집중 모니터링용 정적 프레임 (영상 저장 없음 — URL만 참조) */
export interface FocusMonitorFrame {
  id: string;
  status: AiFocusStatus;
  imageUrl: string;
  label: string;
}

/** 집중 모니터 화면 표시 단계 (실제 녹화 없음) */
export type FocusMonitorDisplayMode = 'standby' | 'live' | 'ended';

/** 입실 후 웹캠처럼 보이는 모니터링 상태 (isRecording은 항상 false) */
export interface FocusMonitorState {
  active: boolean;
  /** standby: 학습 전 검은 화면 · live: 학습 중 프레임 · ended: 학습 종료 후 검은 화면 */
  displayMode: FocusMonitorDisplayMode;
  status: AiFocusStatus;
  frame: FocusMonitorFrame;
  monitoringSince?: string;
  isRecording: false;
  sessionId?: string;
  attendanceId?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  checkInAt: string;
  checkOutAt?: string;
  status: AttendanceStatus;
  purpose?: CheckOutPurpose;
  focusMonitoring?: {
    enabled: boolean;
    currentStatus: AiFocusStatus;
    currentFrameId: string;
    startedAt: string;
  };
}

export interface CheckInResponse {
  attendance: AttendanceRecord;
  focusMonitor: FocusMonitorState;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  plannedDate: string;
  sortOrder: number;
  durationMinutes?: number;
  completed: boolean;
}

export interface CheckInRequest {
  userId: string;
  checkInAt?: string;
}

export interface CheckOutRequest {
  userId: string;
  purpose: CheckOutPurpose;
  checkOutAt?: string;
}

export interface CreateStudyPlanRequest {
  userId: string;
  title: string;
  plannedDate: string;
  durationMinutes?: number;
  sortOrder?: number;
}

export interface UpdateStudyPlanRequest {
  title?: string;
  plannedDate?: string;
  sortOrder?: number;
  durationMinutes?: number;
  completed?: boolean;
}
