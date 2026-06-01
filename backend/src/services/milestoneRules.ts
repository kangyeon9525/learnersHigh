import type { ClientSession } from 'mongoose';
import { MilestoneModel } from '../db/models/index.js';
import { toMilestoneDto } from '../db/mappers.js';

/** conditionCode → 판정 (프로토타입, P2.4.1) */
export async function evaluateMilestones(
  userId: string,
  focusMinutes: number,
  dbSession?: ClientSession,
): Promise<{ newMilestones: ReturnType<typeof toMilestoneDto>[]; bonusScore: number }> {
  let query = MilestoneModel.find({ userId, isAchieved: false });
  if (dbSession) query = query.session(dbSession);
  const milestones = await query;
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
      await m.save({ session: dbSession });
      newlyAchieved.push(toMilestoneDto(m));
      bonusScore += m.rewardScore;
    }
  }

  return { newMilestones: newlyAchieved, bonusScore };
}
