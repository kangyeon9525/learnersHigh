import { fetchGoals, fetchGrowth, fetchMilestones } from '../api/growth';
import { fetchDemoUser } from '../api/study';
import { syncTimerHydration } from './syncTimerHydration';
import {
  demoAttendance,
  demoFocusMonitor,
  demoGoals,
  demoGrowth,
  demoMilestones,
  demoPlans,
  demoUser,
} from '../fixtures/demo-data';
import { useAppStore } from '../stores/useAppStore';

/**
 * 앱 초기 데이터 로드.
 *
 * P1(UI 셸): 백엔드/MongoDB가 없을 수 있으므로 API 실패 시 fixture로 폴백하여
 * 모든 화면을 시연 가능하게 한다. fixture 모드는 store.dataSource='fixture'로 표시한다.
 * TODO(P2/P3): plans·attendance는 실제 API(`/api/plans`, `/api/attendance`)로 로드.
 */
/** 백엔드 기동 레이스(npm run dev 동시 실행) 대비 — 짧은 재시도 후에야 fixture로 폴백 */
async function fetchDemoUserWithRetry(attempts = 5, delayMs = 800) {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetchDemoUser();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

export async function bootstrapApp(): Promise<void> {
  const store = useAppStore.getState();

  try {
    const user = await fetchDemoUserWithRetry();
    store.setUser(user.id, user.displayName);

    const [growth, milestones, goals] = await Promise.all([
      fetchGrowth(user.id),
      fetchMilestones(user.id),
      fetchGoals(user.id),
    ]);

    store.setDataSource('live');
    store.setGrowth(growth);
    store.setMilestones(milestones);
    store.setGoals(goals);
    store.setPlans(demoPlans);

    const { attendance, session, focusMonitor } = await syncTimerHydration(user.id);
    store.setAttendance(attendance);
    store.setActiveSession(session);
    store.setFocusMonitor(
      attendance?.status === 'checked_in' ? focusMonitor ?? demoFocusMonitor : null,
    );
  } catch {
    loadFixtures();
  }
}

/** API 미가동 시 UI 셸을 위한 fixture 적재 */
function loadFixtures(): void {
  const store = useAppStore.getState();
  store.setUser(demoUser.id, demoUser.displayName);
  store.setDataSource('fixture');
  store.setGrowth(demoGrowth);
  store.setMilestones(demoMilestones);
  store.setGoals(demoGoals);
  store.setPlans(demoPlans);
  store.setAttendance(demoAttendance);
  store.setActiveSession(null);
  store.setFocusMonitor(demoFocusMonitor);
}
