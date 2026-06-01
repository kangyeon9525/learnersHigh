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

export interface AttendanceRecord {
  id: string;
  userId: string;
  checkInAt: string;
  checkOutAt?: string;
  status: AttendanceStatus;
  purpose?: CheckOutPurpose;
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
