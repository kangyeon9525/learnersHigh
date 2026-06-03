import mongoose from 'mongoose';
import type { GrowthState } from '@learners-high/shared';
import { GrowthStateModel } from '../db/models/index.js';
import { toGrowthStateDto } from '../db/mappers.js';

/** 누적 점수 → 성장 단계 (0:씨앗 ~ 4:성목) */
export const LIFETIME_STAGE_THRESHOLDS = [0, 100, 300, 600, 1000];
export const MONTHLY_STAGE_THRESHOLDS = [0, 50, 120, 200, 300];
/** 월말 고정 개화 단계 */
export const MONTHLY_BLOOM_STAGE = 4;

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

/** 오늘이 월말(마지막 날)인지 확인 */
function isLastDayOfMonth(): boolean {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return tomorrow.getDate() === 1;
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
    // 월 전환: 이전 달 archive 이관 + 리셋
    const monthly = doc.monthly;
    monthly.archive.push({
      month: monthly.currentMonth,
      totalScore: monthly.totalScore,
      finalStage: MONTHLY_BLOOM_STAGE, // 월말 고정 개화(stage 4)
    });
    monthly.currentMonth = month;
    monthly.totalScore = 0;
    monthly.currentStage = 0;
    await doc.save();
  } else if (doc.monthly && isLastDayOfMonth() && doc.monthly.currentStage < MONTHLY_BLOOM_STAGE) {
    // 월말 고정 개화 트리거
    doc.monthly.currentStage = MONTHLY_BLOOM_STAGE;
    await doc.save();
  }

  return toGrowthStateDto(doc);
}

/**
 * 트랜잭션 내에서 성장 점수를 적립한다 (lifetime + monthly 동시 원자 갱신).
 * settlementService 트랜잭션 내부에서만 호출.
 */
export async function applyScoreInsideTransaction(
  userId: string,
  earnedScore: number,
  dateIso: string,
  beforeLifetimeStage: number,
  mongoSession: mongoose.ClientSession,
): Promise<GrowthState> {
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
          stage: beforeLifetimeStage,
        },
      },
    },
    { new: true, session: mongoSession },
  );

  if (!doc) throw new Error(`GrowthState not found for userId: ${userId}`);

  const lifetime = doc.lifetime!;
  const monthly = doc.monthly!;
  lifetime.currentStage = scoreToStage(lifetime.totalScore, LIFETIME_STAGE_THRESHOLDS);
  monthly.currentStage = scoreToStage(monthly.totalScore, MONTHLY_STAGE_THRESHOLDS);
  await doc.save({ session: mongoSession });

  return toGrowthStateDto(doc);
}

/** 트랜잭션 외부에서 단독 호출 (레거시 호환 — 새 코드는 트랜잭션 버전을 사용할 것) */
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
  lifetime.currentStage = scoreToStage(lifetime.totalScore, LIFETIME_STAGE_THRESHOLDS);
  monthly.currentStage = scoreToStage(monthly.totalScore, MONTHLY_STAGE_THRESHOLDS);
  await doc.save();

  const after = toGrowthStateDto(doc);
  return { before, after };
}
