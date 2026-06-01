/**
 * 시드 시나리오 정의 — E2E·Storybook·수동 QA용 대표/엣지 페르소나
 */
export const SEED_MONTH = '2026-06';

export const DEMO_AI_FOCUS = [
  { at: '2026-06-01T10:00:00.000Z', status: 'focus' as const },
  { at: '2026-06-01T10:15:00.000Z', status: 'focus' as const },
  { at: '2026-06-01T10:30:00.000Z', status: 'distracted' as const },
  { at: '2026-06-01T10:45:00.000Z', status: 'focus' as const },
];

export const DEMO_AI_DISTRACTED = [
  { at: '2026-06-01T14:00:00.000Z', status: 'distracted' as const },
  { at: '2026-06-01T14:05:00.000Z', status: 'distracted' as const },
  { at: '2026-06-01T14:10:00.000Z', status: 'focus' as const },
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
    description: '기본 데모 — 미달성 성취·진행 중 퀘스트',
  },
  {
    key: 'distracted',
    displayName: '박이탈',
    branchId: 'gangnam-01',
    description: '집중 이탈 다수 — mock-ai·타이머 경고 검증',
  },
  {
    key: 'achiever',
    displayName: '최성실',
    branchId: 'gangnam-01',
    description: '고득점·달성 성취 — 정산 모달 복합 결과',
  },
];
