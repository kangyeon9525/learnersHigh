/**
 * 시드 시나리오 정의 — E2E·Storybook·수동 QA용 대표/엣지 페르소나
 * 기준일: 2026-06-05
 */
export const SEED_MONTH = '2026-06';
export const SEED_BASE_DATE = '2026-06-05';
export const SEED_BASE_DATE_ISO = '2026-06-05T09:00:00.000Z';

/** 집중 우세 세션 (achiever / primary) */
export const DEMO_AI_FOCUS = [
  { at: '2026-06-04T10:00:00.000Z', status: 'focus' as const },
  { at: '2026-06-04T10:15:00.000Z', status: 'focus' as const },
  { at: '2026-06-04T10:30:00.000Z', status: 'distracted' as const },
  { at: '2026-06-04T10:45:00.000Z', status: 'focus' as const },
];

/** 이탈 우세 세션 (distracted) */
export const DEMO_AI_DISTRACTED = [
  { at: '2026-06-02T14:00:00.000Z', status: 'distracted' as const },
  { at: '2026-06-02T14:05:00.000Z', status: 'distracted' as const },
  { at: '2026-06-02T14:10:00.000Z', status: 'focus' as const },
];

export interface SeedUserScenario {
  key: 'primary' | 'distracted' | 'achiever';
  displayName: string;
  branchId: string;
  description: string;
}

export const SEED_USERS: SeedUserScenario[] = [
  {
    key: 'primary',
    displayName: '김러너',
    branchId: 'gangnam-01',
    description: '중간 케이스 — 누적 묘목 / 월간 새싹 (성장 중)',
  },
  {
    key: 'distracted',
    displayName: '박이탈',
    branchId: 'gangnam-01',
    description: '미성장 케이스 — 누적·월간 모두 씨앗 단계',
  },
  {
    key: 'achiever',
    displayName: '최성실',
    branchId: 'gangnam-01',
    description: '완전 성장 케이스 — 누적·월간 모두 성목(개화)',
  },
];
