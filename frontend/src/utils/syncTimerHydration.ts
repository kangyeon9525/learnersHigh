import type { AttendanceRecord, FocusMonitorState, StudySession } from '@learners-high/shared';
import { fetchActiveAttendance } from '../api/attendance';
import { fetchFocusMonitorState } from '../api/focusMonitor';
import { abandonActiveSessions, fetchActiveSession } from '../api/study';
import { buildLocalMonitorState } from './focusMonitorFrames';
import { isSessionStale } from './timerSession';

export interface TimerHydrationResult {
  attendance: AttendanceRecord | null;
  session: StudySession | null;
  focusMonitor: FocusMonitorState | null;
}

/** 타이머 진입·새로고침 시 입실/세션/모니터를 정합성 있게 복원 */
export async function syncTimerHydration(userId: string): Promise<TimerHydrationResult> {
  let attendance = await fetchActiveAttendance(userId).catch(() => null);
  let session = await fetchActiveSession(userId).catch(() => null);

  const checkedIn = attendance?.status === 'checked_in';
  const shouldAbandon =
    session != null && (!checkedIn || isSessionStale(session));

  if (shouldAbandon) {
    try {
      await abandonActiveSessions(userId);
    } catch {
      /* 오프라인: 로컬만 비움 */
    }
    session = null;
  }

  let focusMonitor: FocusMonitorState | null = null;
  if (checkedIn) {
    try {
      const remote = await fetchFocusMonitorState(userId);
      focusMonitor = remote.active
        ? remote
        : buildLocalMonitorState(session ? 'live' : 'standby');
    } catch {
      focusMonitor = buildLocalMonitorState(session ? 'live' : 'standby');
    }
  }

  return { attendance, session, focusMonitor };
}
