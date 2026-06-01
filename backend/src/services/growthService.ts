import type { GrowthState } from '@learners-high/shared';
import { GrowthStateModel } from '../db/models/index.js';
import { toGrowthStateDto } from '../db/mappers.js';

/** 누적 점수 → 성장 단계 (0:씨앗 ~ 4:성목) */
const LIFETIME_STAGE_THRESHOLDS = [0, 100, 300, 600, 1000];
const MONTHLY_STAGE_THRESHOLDS = [0, 50, 120, 200, 300];

export function scoreToStage(score: number, thresholds: number[]): number {
  let stage = 0;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (score >= thresholds[i]) {
      stage = i;
      break;
    }
  }
  return stage;
}

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function getOrCreateGrowthState(userId: string): Promise<GrowthState> {
  const month = currentMonthKey();
  let doc = await GrowthStateModel.findOne({ userId });

  if (!doc) {
    doc = await GrowthStateModel.create({
      userId,
      lifetime: { totalScore: 0, currentStage: 0, history: [] },
      monthly: { currentMonth: month, totalScore: 0, currentStage: 0, archive: [] },
    });
  } else if (doc.monthly && doc.monthly.currentMonth !== month) {
    const monthly = doc.monthly;
    monthly.archive.push({
      month: monthly.currentMonth,
      totalScore: monthly.totalScore,
      finalStage: monthly.currentStage,
    });
    monthly.currentMonth = month;
    monthly.totalScore = 0;
    monthly.currentStage = 0;
    await doc.save();
  }

  return toGrowthStateDto(doc);
}

export async function applyScoreToGrowth(
  userId: string,
  earnedScore: number,
  dateIso: string,
): Promise<{ before: GrowthState; after: GrowthState }> {
  const before = await getOrCreateGrowthState(userId);
  const date = dateIso.slice(0, 10);

  const doc = await GrowthStateModel.findOneAndUpdate(
    { userId },
    {
      $inc: {
        'lifetime.totalScore': earnedScore,
        'monthly.totalScore': earnedScore,
      },
      $push: {
        'lifetime.history': {
          date,
          scoreDelta: earnedScore,
          stage: before.lifetime.currentStage,
        },
      },
    },
    { new: true },
  );

  if (!doc) throw new Error('GrowthState not found');

  const lifetime = doc.lifetime!;
  const monthly = doc.monthly!;
  const lifetimeStage = scoreToStage(lifetime.totalScore, LIFETIME_STAGE_THRESHOLDS);
  const monthlyStage = scoreToStage(monthly.totalScore, MONTHLY_STAGE_THRESHOLDS);

  lifetime.currentStage = lifetimeStage;
  monthly.currentStage = monthlyStage;
  await doc.save();

  const after = toGrowthStateDto(doc);
  return { before, after };
}
