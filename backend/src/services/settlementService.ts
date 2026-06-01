import mongoose from 'mongoose';
import type { EndStudySessionRequest, StudySessionResult } from '@learners-high/shared';
import { StudySessionModel } from '../db/models/index.js';
import { toStudySessionDto } from '../db/mappers.js';
import { applyFocusMinutesToGoals } from './goalService.js';
import { applyScoreToGrowth } from './growthService.js';
import { evaluateMilestones } from './milestoneRules.js';
import { clampFocusMinutes } from './sessionDuration.js';

const SESSION_BASE_SCORE_PER_MINUTE = 2;

export async function settleStudySession(
  body: EndStudySessionRequest,
  sessionId: string,
): Promise<StudySessionResult> {
  const focusMinutes = clampFocusMinutes(body.startedAt, body.endedAt, body.focusMinutes);
  const dbSession = await mongoose.startSession();

  let sessionDto: ReturnType<typeof toStudySessionDto>;
  let newMilestones: StudySessionResult['newMilestones'];
  let completedGoals: StudySessionResult['completedGoals'];
  let earnedScore: number;

  try {
    dbSession.startTransaction();

    const session = await StudySessionModel.findByIdAndUpdate(
      sessionId,
      {
        endedAt: body.endedAt,
        focusMinutes,
        satisfaction: body.satisfaction,
        progress: body.progress,
        completed: true,
        ...(body.aiEvents ? { aiEvents: body.aiEvents } : {}),
      },
      { new: true, session: dbSession },
    );

    if (!session) throw new Error('Session not found');

    const baseScore = focusMinutes * SESSION_BASE_SCORE_PER_MINUTE;
    const { newMilestones: milestones, bonusScore: milestoneBonus } = await evaluateMilestones(
      body.userId,
      focusMinutes,
      dbSession,
    );
    const { completedGoals: goals, bonusScore: goalBonus } = await applyFocusMinutesToGoals(
      body.userId,
      focusMinutes,
      dbSession,
    );

    await dbSession.commitTransaction();

    sessionDto = toStudySessionDto(session);
    newMilestones = milestones;
    completedGoals = goals;
    earnedScore = baseScore + milestoneBonus + goalBonus;
  } catch (err) {
    await dbSession.abortTransaction();
    throw err;
  } finally {
    dbSession.endSession();
  }

  const { before, after } = await applyScoreToGrowth(body.userId, earnedScore, body.endedAt);

  return {
    sessionId: sessionDto.id,
    focusMinutes,
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
