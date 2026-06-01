import type { GoalCycle } from '@learners-high/shared';

export function formatMinutes(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** H:MM:SS — 타이머 대형 표시용 */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const GROWTH_STAGE_LABELS = ['씨앗', '새싹', '묘목', '나무', '성목'] as const;

export function stageLabel(stage: number): string {
  return GROWTH_STAGE_LABELS[stage] ?? `단계 ${stage}`;
}

/** 성장 단계 배지 (홈·정산 모달) */
export function stageBadgeLabel(stage: number): string {
  return `${stageLabel(stage)} 단계`;
}

const GOAL_CYCLE_LABELS: Record<GoalCycle, string> = {
  daily: '일일',
  weekly: '주간',
  monthly: '월간',
};

export function goalCycleLabel(cycle: GoalCycle): string {
  return GOAL_CYCLE_LABELS[cycle] ?? cycle;
}

/** YYYY-MM → "5월" */
export function monthShortLabel(month: string): string {
  const idx = Number(month.slice(5, 7));
  if (!idx || idx < 1 || idx > 12) return month;
  return `${idx}월`;
}
