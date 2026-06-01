import { create } from 'zustand';
import type {
  AttendanceRecord,
  FocusMonitorState,
  Goal,
  GrowthState,
  Milestone,
  StudyPlan,
  StudySession,
  StudySessionResult,
} from '@learners-high/shared';

/** P1: API 실패 시 fixture로 채운 UI 셸인지 표시 (배너 노출용) */
export type DataSource = 'live' | 'fixture';

interface AppState {
  userId: string | null;
  displayName: string;
  dataSource: DataSource;
  activeSession: StudySession | null;
  growth: GrowthState | null;
  milestones: Milestone[];
  goals: Goal[];
  plans: StudyPlan[];
  attendance: AttendanceRecord | null;
  focusMonitor: FocusMonitorState | null;
  lastSettlement: StudySessionResult | null;
  showResultModal: boolean;
  distractedWarning: boolean;
  setUser: (id: string, name: string) => void;
  setDataSource: (source: DataSource) => void;
  setActiveSession: (session: StudySession | null) => void;
  setGrowth: (growth: GrowthState | null) => void;
  setMilestones: (items: Milestone[]) => void;
  setGoals: (items: Goal[]) => void;
  setPlans: (items: StudyPlan[]) => void;
  setAttendance: (record: AttendanceRecord | null) => void;
  setFocusMonitor: (state: FocusMonitorState | null) => void;
  openSettlement: (result: StudySessionResult) => void;
  closeSettlement: () => void;
  setDistractedWarning: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userId: null,
  displayName: '',
  dataSource: 'live',
  activeSession: null,
  growth: null,
  milestones: [],
  goals: [],
  plans: [],
  attendance: null,
  focusMonitor: null,
  lastSettlement: null,
  showResultModal: false,
  distractedWarning: false,
  setUser: (id, name) => set({ userId: id, displayName: name }),
  setDataSource: (dataSource) => set({ dataSource }),
  setActiveSession: (session) => set({ activeSession: session }),
  setGrowth: (growth) => set({ growth }),
  setMilestones: (milestones) => set({ milestones }),
  setGoals: (goals) => set({ goals }),
  setPlans: (plans) => set({ plans }),
  setAttendance: (attendance) => set({ attendance }),
  setFocusMonitor: (focusMonitor) => set({ focusMonitor }),
  openSettlement: (result) => set({ lastSettlement: result, showResultModal: true }),
  closeSettlement: () => set({ showResultModal: false }),
  setDistractedWarning: (distractedWarning) => set({ distractedWarning }),
}));
