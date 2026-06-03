import mongoose from 'mongoose';
import type { GrowthState, StudySessionResult } from '@learners-high/shared';
import type { EndStudySessionRequest } from '@learners-high/shared';
import { StudySessionModel } from '../db/models/index.js';
import { toStudySessionDto } from '../db/mappers.js';
import { applyFocusMinutesToGoals } from './goalService.js';
import { applyScoreInsideTransaction, getOrCreateGrowthState } from './growthService.js';
import { evaluateMilestones } from './milestoneRules.js';
import { clampFocusMinutes } from './sessionDuration.js';

const SESSION_BASE_SCORE_PER_MINUTE = 2;

export async function settleStudySession(
  body: EndStudySessionRequest,
  sessionId: string,
): Promise<StudySessionResult> {
  const focusMinutes = clampFocusMinutes(body.startedAt, body.endedAt, body.focusMinutes);

  // 트랜잭션 전: growth 문서 존재 보장 + before 스냅샷 획득
  const before = await getOrCreateGrowthState(body.userId);

  const dbSession = await mongoose.startSession();

  let sessionDto: ReturnType<typeof toStudySessionDto> | undefined;
  let newMilestones: StudySessionResult['newMilestones'] = [];
  let completedGoals: StudySessionResult['completedGoals'] = [];
  let earnedScore = 0;
  let after: GrowthState = before;

  try {
    // withTransaction 으로 TransientTransactionError 자동 재시도 처리
    await dbSession.withTransaction(async () => {
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

      earnedScore = baseScore + milestoneBonus + goalBonus;

      after = await applyScoreInsideTransaction(
        body.userId,
        earnedScore,
        body.endedAt,
        before.lifetime.currentStage,
        dbSession,
      );

      sessionDto = toStudySessionDto(session);
      newMilestones = milestones;
      completedGoals = goals;
    });
  } finally {
    await dbSession.endSession();
  }

  if (!sessionDto) throw new Error('Transaction failed: sessionDto not set');

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
