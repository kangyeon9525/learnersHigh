import type { StudySession } from '@learners-high/shared';

/** 이 시간보다 오래된 미완료 세션은 ‘유령 세션’으로 간주하고 정리한다 */
export const STALE_SESSION_MS = 30 * 60 * 1000;

export function isSessionStale(session: StudySession): boolean {
  const started = new Date(session.startedAt).getTime();
  if (Number.isNaN(started)) return true;
  return Date.now() - started > STALE_SESSION_MS;
}
