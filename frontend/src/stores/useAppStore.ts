import { create } from 'zustand';
import type { Goal, GrowthState, Milestone, StudySession, StudySessionResult } from '@learners-high/shared';

interface AppState {
  userId: string | null;
  displayName: string;
  activeSession: StudySession | null;
  growth: GrowthState | null;
  milestones: Milestone[];
  goals: Goal[];
  lastSettlement: StudySessionResult | null;
  showResultModal: boolean;
  distractedWarning: boolean;
  setUser: (id: string, name: string) => void;
  setActiveSession: (session: StudySession | null) => void;
  setGrowth: (growth: GrowthState | null) => void;
  setMilestones: (items: Milestone[]) => void;
  setGoals: (items: Goal[]) => void;
  openSettlement: (result: StudySessionResult) => void;
  closeSettlement: () => void;
  setDistractedWarning: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userId: null,
  displayName: '',
  activeSession: null,
  growth: null,
  milestones: [],
  goals: [],
  lastSettlement: null,
  showResultModal: false,
  distractedWarning: false,
  setUser: (id, name) => set({ userId: id, displayName: name }),
  setActiveSession: (session) => set({ activeSession: session }),
  setGrowth: (growth) => set({ growth }),
  setMilestones: (milestones) => set({ milestones }),
  setGoals: (goals) => set({ goals }),
  openSettlement: (result) => set({ lastSettlement: result, showResultModal: true }),
  closeSettlement: () => set({ showResultModal: false }),
  setDistractedWarning: (distractedWarning) => set({ distractedWarning }),
}));
