import type { EndStudySessionRequest, StudySessionResult } from '@learners-high/shared';
import { GoalModel, MilestoneModel, StudySessionModel } from '../db/models/index.js';
import { toGoalDto, toMilestoneDto, toStudySessionDto } from '../db/mappers.js';
import { applyScoreToGrowth } from './growthService.js';

const SESSION_BASE_SCORE_PER_MINUTE = 2;

/** conditionCode → 판정 (프로토타입) */
async function evaluateMilestones(
  userId: string,
  focusMinutes: number,
): Promise<{ newMilestones: ReturnType<typeof toMilestoneDto>[]; bonusScore: number }> {
  const milestones = await MilestoneModel.find({ userId, isAchieved: false });
  const newlyAchieved: ReturnType<typeof toMilestoneDto>[] = [];
  let bonusScore = 0;

  for (const m of milestones) {
    let achieved = false;
    if (m.conditionCode === 'FOCUS_60_MIN' && focusMinutes >= 60) achieved = true;
    if (m.conditionCode === 'FOCUS_30_MIN' && focusMinutes >= 30) achieved = true;
    if (m.conditionCode === 'FIRST_SESSION' && focusMinutes >= 1) achieved = true;

    if (achieved) {
      m.isAchieved = true;
      m.achievedAt = new Date().toISOString();
      await m.save();
      newlyAchieved.push(toMilestoneDto(m));
      bonusScore += m.rewardScore;
    }
  }

  return { newMilestones: newlyAchieved, bonusScore };
}

async function evaluateGoals(
  userId: string,
  focusMinutes: number,
): Promise<{ completedGoals: ReturnType<typeof toGoalDto>[]; bonusScore: number }> {
  const goals = await GoalModel.find({ userId, isCompleted: false });
  const completed: ReturnType<typeof toGoalDto>[] = [];
  let bonusScore = 0;

  for (const g of goals) {
    g.currentValue = Math.min(g.targetValue, (g.currentValue ?? 0) + focusMinutes);
    if (g.currentValue >= g.targetValue && !g.isCompleted) {
      g.isCompleted = true;
      completed.push(toGoalDto(g));
      bonusScore += g.rewardScore;
    }
    await g.save();
  }

  return { completedGoals: completed, bonusScore };
}

export async function settleStudySession(
  body: EndStudySessionRequest,
  sessionId: string,
): Promise<StudySessionResult> {
  const session = await StudySessionModel.findByIdAndUpdate(
    sessionId,
    {
      endedAt: body.endedAt,
      focusMinutes: body.focusMinutes,
      satisfaction: body.satisfaction,
      completed: true,
      ...(body.aiEvents ? { aiEvents: body.aiEvents } : {}),
    },
    { new: true },
  );

  if (!session) throw new Error('Session not found');

  const baseScore = body.focusMinutes * SESSION_BASE_SCORE_PER_MINUTE;
  const { newMilestones, bonusScore: milestoneBonus } = await evaluateMilestones(
    body.userId,
    body.focusMinutes,
  );
  const { completedGoals, bonusScore: goalBonus } = await evaluateGoals(
    body.userId,
    body.focusMinutes,
  );

  const earnedScore = baseScore + milestoneBonus + goalBonus;
  const { before, after } = await applyScoreToGrowth(body.userId, earnedScore, body.endedAt);

  return {
    sessionId: toStudySessionDto(session).id,
    focusMinutes: body.focusMinutes,
    earnedScore,
    newMilestones,
    completedGoals,
    growthDelta: {
      lifetime: {
        fromStage: before.lifetime.currentStage,
        toStage: after.lifetime.currentStage,
      },
      monthly: {
        fromStage: before.monthly.currentStage,
        toStage: after.monthly.currentStage,
      },
    },
  };
}
