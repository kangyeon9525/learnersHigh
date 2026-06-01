/** 클라이언트 focusMinutes가 경과 시간을 초과하지 않도록 정합 (P2.2.5) */
export function clampFocusMinutes(
  startedAt: string,
  endedAt: string,
  focusMinutes: number,
): number {
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return Math.max(0, focusMinutes);
  }
  const elapsedMinutes = Math.floor((end - start) / 60_000);
  const cap = Math.max(0, elapsedMinutes);
  return Math.min(Math.max(0, focusMinutes), cap);
}
