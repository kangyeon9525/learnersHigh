import mongoose from 'mongoose';
import { config } from '../config.js';
import {
  GoalModel,
  GrowthStateModel,
  MilestoneModel,
  StudyPlanModel,
  StudySessionModel,
  UserModel,
} from '../db/models/index.js';
import {
  DEMO_AI_DISTRACTED,
  DEMO_AI_FOCUS,
  SEED_BASE_DATE,
  SEED_MONTH,
  SEED_USERS,
} from './scenarios.js';

/** 기준일 2026-06-05 09:00 UTC. 모든 상대 타임스탬프의 기준점. */
const BASE_MS = Date.parse('2026-06-05T09:00:00.000Z');
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MIN_MS = 60 * 1000;

/** 6/5 기준 day 오프셋(예: -1 = 6/4) + 시각을 ISO 문자열로 변환 */
function offsetISO(dayOffset: number, hourOffset = 0, minuteOffset = 0): string {
  return new Date(
    BASE_MS + dayOffset * DAY_MS + hourOffset * HOUR_MS + minuteOffset * MIN_MS,
  ).toISOString();
}

async function seed() {
  await mongoose.connect(config.mongodbUri);
  console.log('[seed] Connected to MongoDB');

  await Promise.all([
    UserModel.deleteMany({}),
    StudySessionModel.deleteMany({}),
    StudyPlanModel.deleteMany({}),
    MilestoneModel.deleteMany({}),
    GoalModel.deleteMany({}),
    GrowthStateModel.deleteMany({}),
  ]);

  const created: Array<{ key: string; userId: string; displayName: string }> = [];

  for (const scenario of SEED_USERS) {
    const user = await UserModel.create({
      displayName: scenario.displayName,
      branchId: scenario.branchId,
    });
    const userId = user._id;
    created.push({ key: scenario.key, userId: userId.toString(), displayName: scenario.displayName });

    if (scenario.key === 'primary') {
      await seedPrimary(userId);
    } else if (scenario.key === 'distracted') {
      await seedDistracted(userId);
    } else if (scenario.key === 'achiever') {
      await seedAchiever(userId);
    }
  }

  console.log('[seed] Done. Users:');
  for (const u of created) {
    console.log(`  - ${u.key} (${u.displayName}): ${u.userId}`);
  }
  console.log(`[seed] Base date: ${SEED_BASE_DATE} (month ${SEED_MONTH})`);
  console.log('[seed] Demo API uses first user: GET /api/users/demo');

  await mongoose.disconnect();
}

/* ────────────────────────────────────────────────────────────────────
 * 중간 케이스: 누적 묘목(stage 2) · 월간 새싹(stage 1)
 *   - lifetime.totalScore = 350 (>=300 → 묘목)
 *   - monthly.totalScore  =  90 (>= 50 → 새싹)
 *   - 6월 1~4 일별 적립 기록 + 5월 후반 일부
 * ─────────────────────────────────────────────────────────────────── */
async function seedPrimary(userId: mongoose.Types.ObjectId) {
  await GrowthStateModel.create({
    userId,
    lifetime: {
      totalScore: 350,
      currentStage: 2,
      history: [
        { date: '2026-05-28', scoreDelta: 30, stage: 1 },
        { date: '2026-05-30', scoreDelta: 35, stage: 2 },
        { date: '2026-06-01', scoreDelta: 20, stage: 2 },
        { date: '2026-06-02', scoreDelta: 25, stage: 2 },
        { date: '2026-06-03', scoreDelta: 20, stage: 2 },
        { date: '2026-06-04', scoreDelta: 25, stage: 2 },
      ],
    },
    monthly: {
      currentMonth: SEED_MONTH,
      totalScore: 90,
      currentStage: 1,
      archive: [
        { month: '2026-04', totalScore: 130, finalStage: 2 },
        { month: '2026-05', totalScore: 230, finalStage: 3 },
      ],
    },
  });

  await MilestoneModel.insertMany([
    {
      userId,
      title: '첫 학습 완료',
      conditionCode: 'FIRST_SESSION',
      rewardScore: 50,
      isAchieved: true,
      achievedAt: '2026-04-10T09:00:00.000Z',
    },
    {
      userId,
      title: '순공 30분 달성',
      conditionCode: 'FOCUS_30_MIN',
      rewardScore: 100,
      isAchieved: true,
      achievedAt: '2026-06-02T11:30:00.000Z',
    },
    {
      userId,
      title: '순공 60분 달성',
      conditionCode: 'FOCUS_60_MIN',
      rewardScore: 200,
      isAchieved: false,
    },
  ]);

  await GoalModel.insertMany([
    { userId, cycle: 'daily', targetValue: 60, currentValue: 0, rewardScore: 80, isCompleted: false },
    { userId, cycle: 'weekly', targetValue: 300, currentValue: 195, rewardScore: 150, isCompleted: false },
    { userId, cycle: 'monthly', targetValue: 1200, currentValue: 245, rewardScore: 300, isCompleted: false },
  ]);

  // 6월 1~4 매일 학습 세션 (집중 우세, 점진적 향상)
  await StudySessionModel.insertMany([
    {
      userId,
      startedAt: offsetISO(-4, 1),  // 2026-06-01 10:00
      endedAt: offsetISO(-4, 1, 25),
      focusMinutes: 25,
      satisfaction: 3,
      completed: true,
      aiEvents: DEMO_AI_FOCUS,
    },
    {
      userId,
      startedAt: offsetISO(-3, 1),  // 2026-06-02 10:00
      endedAt: offsetISO(-3, 1, 50),
      focusMinutes: 50,
      satisfaction: 5,
      completed: true,
      aiEvents: DEMO_AI_FOCUS,
    },
    {
      userId,
      startedAt: offsetISO(-2, 1),  // 2026-06-03 10:00
      endedAt: offsetISO(-2, 1, 35),
      focusMinutes: 35,
      satisfaction: 4,
      completed: true,
      aiEvents: DEMO_AI_FOCUS,
    },
    {
      userId,
      startedAt: offsetISO(-1, 1),  // 2026-06-04 10:00
      endedAt: offsetISO(-1, 1, 40),
      focusMinutes: 40,
      satisfaction: 4,
      completed: true,
      aiEvents: DEMO_AI_FOCUS,
    },
  ]);

  // 오늘(6/5)의 학습 계획
  await StudyPlanModel.insertMany([
    {
      userId,
      title: '수학 · 4장 미적분',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 0,
      durationMinutes: 90,
      completed: false,
    },
    {
      userId,
      title: '영어 · 에세이 쓰기 연습',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 1,
      durationMinutes: 45,
      completed: false,
    },
    {
      userId,
      title: '과학 · 세포 생물학 복습',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 2,
      durationMinutes: 60,
      completed: false,
    },
  ]);
}

/* ────────────────────────────────────────────────────────────────────
 * 미성장 케이스: 누적·월간 모두 씨앗(stage 0)
 *   - lifetime.totalScore = 25  (<100 → 씨앗)
 *   - monthly.totalScore  = 15  (<50  → 씨앗)
 * ─────────────────────────────────────────────────────────────────── */
async function seedDistracted(userId: mongoose.Types.ObjectId) {
  await GrowthStateModel.create({
    userId,
    lifetime: {
      totalScore: 25,
      currentStage: 0,
      history: [
        { date: '2026-05-28', scoreDelta: 10, stage: 0 },
        { date: '2026-06-02', scoreDelta: 15, stage: 0 },
      ],
    },
    monthly: {
      currentMonth: SEED_MONTH,
      totalScore: 15,
      currentStage: 0,
      archive: [{ month: '2026-05', totalScore: 10, finalStage: 0 }],
    },
  });

  await MilestoneModel.insertMany([
    {
      userId,
      title: '첫 학습 완료',
      conditionCode: 'FIRST_SESSION',
      rewardScore: 50,
      isAchieved: true,
      achievedAt: '2026-06-02T14:00:00.000Z',
    },
    {
      userId,
      title: '순공 30분 달성',
      conditionCode: 'FOCUS_30_MIN',
      rewardScore: 100,
      isAchieved: false,
    },
    {
      userId,
      title: '순공 60분 달성',
      conditionCode: 'FOCUS_60_MIN',
      rewardScore: 200,
      isAchieved: false,
    },
  ]);

  await GoalModel.insertMany([
    { userId, cycle: 'daily', targetValue: 60, currentValue: 5, rewardScore: 80, isCompleted: false },
    { userId, cycle: 'weekly', targetValue: 300, currentValue: 20, rewardScore: 150, isCompleted: false },
    { userId, cycle: 'monthly', targetValue: 1200, currentValue: 28, rewardScore: 300, isCompleted: false },
  ]);

  // 6/2 짧은 이탈성 세션
  await StudySessionModel.create({
    userId,
    startedAt: offsetISO(-3, 5),  // 2026-06-02 14:00
    endedAt: offsetISO(-3, 5, 12),
    focusMinutes: 8,
    satisfaction: 2,
    completed: true,
    focusAlertTriggered: true,
    aiEvents: DEMO_AI_DISTRACTED,
  });

  // 오늘(6/5)의 학습 계획 — 가벼움
  await StudyPlanModel.insertMany([
    {
      userId,
      title: '수학 · 기초 연산 워밍업',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 0,
      durationMinutes: 30,
      completed: false,
    },
    {
      userId,
      title: '영어 · 단어 20개 암기',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 1,
      durationMinutes: 20,
      completed: false,
    },
  ]);
}

/* ────────────────────────────────────────────────────────────────────
 * 완성 케이스: 누적·월간 모두 성목(stage 4)
 *   - lifetime.totalScore = 1280 (>=1000 → 성목)
 *   - monthly.totalScore  =  320 (>= 300 → 성목/개화)
 *   - 매일 풀집중, 모든 성취 달성, 일일/주간/월간 퀘스트 완료
 * ─────────────────────────────────────────────────────────────────── */
async function seedAchiever(userId: mongoose.Types.ObjectId) {
  await GrowthStateModel.create({
    userId,
    lifetime: {
      totalScore: 1280,
      currentStage: 4,
      history: [
        { date: '2026-05-28', scoreDelta: 70, stage: 3 },
        { date: '2026-05-29', scoreDelta: 65, stage: 3 },
        { date: '2026-05-30', scoreDelta: 75, stage: 4 },
        { date: '2026-05-31', scoreDelta: 55, stage: 4 },
        { date: '2026-06-01', scoreDelta: 85, stage: 4 },
        { date: '2026-06-02', scoreDelta: 75, stage: 4 },
        { date: '2026-06-03', scoreDelta: 80, stage: 4 },
        { date: '2026-06-04', scoreDelta: 80, stage: 4 },
      ],
    },
    monthly: {
      currentMonth: SEED_MONTH,
      totalScore: 320,
      currentStage: 4,
      archive: [
        { month: '2026-03', totalScore: 200, finalStage: 3 },
        { month: '2026-04', totalScore: 260, finalStage: 3 },
        { month: '2026-05', totalScore: 310, finalStage: 4 },
      ],
    },
  });

  await MilestoneModel.insertMany([
    {
      userId,
      title: '첫 학습 완료',
      conditionCode: 'FIRST_SESSION',
      rewardScore: 50,
      isAchieved: true,
      achievedAt: '2026-03-15T10:00:00.000Z',
    },
    {
      userId,
      title: '순공 30분 달성',
      conditionCode: 'FOCUS_30_MIN',
      rewardScore: 100,
      isAchieved: true,
      achievedAt: '2026-04-02T11:00:00.000Z',
    },
    {
      userId,
      title: '순공 60분 달성',
      conditionCode: 'FOCUS_60_MIN',
      rewardScore: 200,
      isAchieved: true,
      achievedAt: '2026-05-10T11:00:00.000Z',
    },
  ]);

  await GoalModel.insertMany([
    { userId, cycle: 'daily', targetValue: 60, currentValue: 80, rewardScore: 80, isCompleted: true },
    { userId, cycle: 'weekly', targetValue: 300, currentValue: 310, rewardScore: 150, isCompleted: true },
    { userId, cycle: 'monthly', targetValue: 1200, currentValue: 1350, rewardScore: 300, isCompleted: true },
  ]);

  // 6월 1~4 매일 풀집중 세션
  await StudySessionModel.insertMany([
    {
      userId,
      startedAt: offsetISO(-4, 0),  // 2026-06-01 09:00
      endedAt: offsetISO(-4, 0, 70),
      focusMinutes: 70,
      satisfaction: 4,
      completed: true,
      aiEvents: DEMO_AI_FOCUS,
    },
    {
      userId,
      startedAt: offsetISO(-3, 0),  // 2026-06-02 09:00
      endedAt: offsetISO(-3, 0, 80),
      focusMinutes: 80,
      satisfaction: 5,
      completed: true,
      aiEvents: DEMO_AI_FOCUS,
    },
    {
      userId,
      startedAt: offsetISO(-2, 0),  // 2026-06-03 09:00
      endedAt: offsetISO(-2, 0, 75),
      focusMinutes: 75,
      satisfaction: 5,
      completed: true,
      aiEvents: DEMO_AI_FOCUS,
    },
    {
      userId,
      startedAt: offsetISO(-1, 0),  // 2026-06-04 09:00
      endedAt: offsetISO(-1, 0, 85),
      focusMinutes: 85,
      satisfaction: 5,
      completed: true,
      aiEvents: DEMO_AI_FOCUS,
    },
  ]);

  // 오늘(6/5)의 학습 계획 — 일부 완료
  await StudyPlanModel.insertMany([
    {
      userId,
      title: '국어 · 현대 시 분석',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 0,
      durationMinutes: 60,
      completed: true,
    },
    {
      userId,
      title: '수학 · 확률과 통계',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 1,
      durationMinutes: 90,
      completed: true,
    },
    {
      userId,
      title: '영어 · 장문 독해',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 2,
      durationMinutes: 60,
      completed: false,
    },
    {
      userId,
      title: '한국사 · 근현대사 정리',
      plannedDate: SEED_BASE_DATE,
      sortOrder: 3,
      durationMinutes: 45,
      completed: false,
    },
  ]);
}

seed().catch((err) => {
  console.error('[seed] Failed', err);
  process.exit(1);
});
