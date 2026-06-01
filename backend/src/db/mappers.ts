import type { Goal, GrowthState, Milestone, StudySession, User } from '@learners-high/shared';
import type { GoalDocument } from './models/Goal.js';
import type { GrowthStateDocument } from './models/GrowthState.js';
import type { MilestoneDocument } from './models/Milestone.js';
import type { StudySessionDocument } from './models/StudySession.js';
import type { UserDocument } from './models/User.js';

export function toUserDto(doc: UserDocument): User {
  return {
    id: doc._id.toString(),
    displayName: doc.displayName,
    branchId: doc.branchId,
  };
}

export function toStudySessionDto(doc: StudySessionDocument): StudySession {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    startedAt: doc.startedAt,
    endedAt: doc.endedAt ?? doc.startedAt,
    focusMinutes: doc.focusMinutes ?? 0,
    satisfaction: (doc.satisfaction ?? 3) as StudySession['satisfaction'],
    completed: doc.completed ?? false,
    aiEvents: (doc.aiEvents ?? []).map((e) => ({
      at: e.at,
      status: e.status as 'focus' | 'distracted',
    })),
  };
}

export function toMilestoneDto(doc: MilestoneDocument): Milestone {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    title: doc.title,
    conditionCode: doc.conditionCode,
    rewardScore: doc.rewardScore,
    isAchieved: doc.isAchieved ?? false,
    achievedAt: doc.achievedAt ?? undefined,
  };
}

export function toGoalDto(doc: GoalDocument): Goal {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    cycle: doc.cycle as Goal['cycle'],
    targetValue: doc.targetValue,
    currentValue: doc.currentValue ?? 0,
    rewardScore: doc.rewardScore,
    isCompleted: doc.isCompleted ?? false,
  };
}

export function toGrowthStateDto(doc: GrowthStateDocument): GrowthState {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    lifetime: {
      totalScore: doc.lifetime?.totalScore ?? 0,
      currentStage: doc.lifetime?.currentStage ?? 0,
      history: (doc.lifetime?.history ?? []).map((h) => ({
        date: h.date ?? '',
        scoreDelta: h.scoreDelta ?? 0,
        stage: h.stage ?? 0,
      })),
    },
    monthly: {
      currentMonth: doc.monthly?.currentMonth ?? '',
      totalScore: doc.monthly?.totalScore ?? 0,
      currentStage: doc.monthly?.currentStage ?? 0,
      archive: (doc.monthly?.archive ?? []).map((a) => ({
        month: a.month ?? '',
        totalScore: a.totalScore ?? 0,
        finalStage: a.finalStage ?? 0,
      })),
    },
  };
}
