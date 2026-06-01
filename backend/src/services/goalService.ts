import type { ClientSession } from 'mongoose';
import { GoalModel } from '../db/models/index.js';
import { toGoalDto } from '../db/mappers.js';

/** 학습 종료 시 focusMinutes를 목표 진행에 반영 (P2.4.3) */
export async function applyFocusMinutesToGoals(
  userId: string,
  focusMinutes: number,
  dbSession?: ClientSession,
): Promise<{ completedGoals: ReturnType<typeof toGoalDto>[]; bonusScore: number }> {
  let query = GoalModel.find({ userId, isCompleted: false });
  if (dbSession) query = query.session(dbSession);
  const goals = await query;
  const completed: ReturnType<typeof toGoalDto>[] = [];
  let bonusScore = 0;

  for (const g of goals) {
    g.currentValue = Math.min(g.targetValue, (g.currentValue ?? 0) + focusMinutes);
    if (g.currentValue >= g.targetValue && !g.isCompleted) {
      g.isCompleted = true;
      completed.push(toGoalDto(g));
      bonusScore += g.rewardScore;
    }
    await g.save({ session: dbSession });
  }

  return { completedGoals: completed, bonusScore };
}
