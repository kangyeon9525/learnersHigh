export function formatMinutes(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const GROWTH_STAGE_LABELS = ['씨앗', '새싹', '묘목', '나무', '성목'] as const;

export function stageLabel(stage: number): string {
  return GROWTH_STAGE_LABELS[stage] ?? `단계 ${stage}`;
}
