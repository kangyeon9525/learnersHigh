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
  SEED_MONTH,
  SEED_USERS,
} from './scenarios.js';

function todayPlannedDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
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
  console.log('[seed] Demo API uses first user: GET /api/users/demo');

  await mongoose.disconnect();
}

async function seedPrimary(userId: mongoose.Types.ObjectId) {
  await GrowthStateModel.create({
    userId,
    lifetime: {
      totalScore: 80,
      currentStage: 0,
      history: [{ date: '2026-06-01', scoreDelta: 25, stage: 0 }],
    },
    monthly: {
      currentMonth: SEED_MONTH,
      totalScore: 40,
      currentStage: 0,
      archive: [
        { month: '2026-05', totalScore: 220, finalStage: 2 },
        { month: '2026-04', totalScore: 150, finalStage: 1 },
      ],
    },
  });

  await MilestoneModel.insertMany([
    {
      userId,
      title: '첫 학습 완료',
      conditionCode: 'FIRST_SESSION',
      rewardScore: 50,
      isAchieved: false,
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
    { userId, cycle: 'daily', targetValue: 60, currentValue: 20, rewardScore: 80, isCompleted: false },
    { userId, cycle: 'weekly', targetValue: 300, currentValue: 120, rewardScore: 150, isCompleted: false },
    { userId, cycle: 'monthly', targetValue: 1200, currentValue: 400, rewardScore: 300, isCompleted: false },
  ]);

  await StudySessionModel.create({
    userId,
    startedAt: new Date(Date.now() - 3600_000).toISOString(),
    endedAt: new Date(Date.now() - 1800_000).toISOString(),
    focusMinutes: 25,
    satisfaction: 4,
    completed: true,
    aiEvents: DEMO_AI_FOCUS,
  });

  const plannedDate = todayPlannedDate();
  await StudyPlanModel.insertMany([
    {
      userId,
      title: '수학 · 4장 미적분',
      plannedDate,
      sortOrder: 0,
      durationMinutes: 90,
      completed: false,
    },
    {
      userId,
      title: '영어 · 에세이 쓰기 연습',
      plannedDate,
      sortOrder: 1,
      durationMinutes: 45,
      completed: false,
    },
    {
      userId,
      title: '과학 · 세포 생물학 복습',
      plannedDate,
      sortOrder: 2,
      durationMinutes: 60,
      completed: false,
    },
  ]);
}

async function seedDistracted(userId: mongoose.Types.ObjectId) {
  await GrowthStateModel.create({
    userId,
    lifetime: { totalScore: 15, currentStage: 0, history: [] },
    monthly: {
      currentMonth: SEED_MONTH,
      totalScore: 15,
      currentStage: 0,
      archive: [],
    },
  });

  await MilestoneModel.insertMany([
    {
      userId,
      title: '첫 학습 완료',
      conditionCode: 'FIRST_SESSION',
      rewardScore: 50,
      isAchieved: true,
      achievedAt: '2026-05-20T09:00:00.000Z',
    },
  ]);

  await GoalModel.create({
    userId,
    cycle: 'daily',
    targetValue: 60,
    currentValue: 5,
    rewardScore: 80,
    isCompleted: false,
  });

  await StudySessionModel.create({
    userId,
    startedAt: new Date(Date.now() - 7200_000).toISOString(),
    endedAt: new Date(Date.now() - 5400_000).toISOString(),
    focusMinutes: 8,
    satisfaction: 2,
    completed: true,
    aiEvents: DEMO_AI_DISTRACTED,
  });
}

async function seedAchiever(userId: mongoose.Types.ObjectId) {
  await GrowthStateModel.create({
    userId,
    lifetime: {
      totalScore: 680,
      currentStage: 3,
      history: [
        { date: '2026-05-28', scoreDelta: 120, stage: 2 },
        { date: '2026-05-30', scoreDelta: 80, stage: 3 },
      ],
    },
    monthly: {
      currentMonth: SEED_MONTH,
      totalScore: 210,
      currentStage: 2,
      archive: [{ month: '2026-05', totalScore: 280, finalStage: 3 }],
    },
  });

  await MilestoneModel.insertMany([
    {
      userId,
      title: '첫 학습 완료',
      conditionCode: 'FIRST_SESSION',
      rewardScore: 50,
      isAchieved: true,
      achievedAt: '2026-05-01T10:00:00.000Z',
    },
    {
      userId,
      title: '순공 30분 달성',
      conditionCode: 'FOCUS_30_MIN',
      rewardScore: 100,
      isAchieved: true,
      achievedAt: '2026-05-15T11:00:00.000Z',
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
    { userId, cycle: 'daily', targetValue: 60, currentValue: 60, rewardScore: 80, isCompleted: true },
    { userId, cycle: 'weekly', targetValue: 300, currentValue: 280, rewardScore: 150, isCompleted: false },
  ]);

  await StudySessionModel.create({
    userId,
    startedAt: new Date(Date.now() - 86400_000).toISOString(),
    endedAt: new Date(Date.now() - 82800_000).toISOString(),
    focusMinutes: 55,
    satisfaction: 5,
    completed: true,
    aiEvents: DEMO_AI_FOCUS,
  });
}

seed().catch((err) => {
  console.error('[seed] Failed', err);
  process.exit(1);
});
