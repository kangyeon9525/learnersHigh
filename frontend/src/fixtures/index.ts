/**
 * P1.2.3 — 화면별 fixture 단일 진입점 (시드 스냅샷 형태).
 * P2/P3에서 API 응답으로 교체 시 import 경로만 변경하면 된다.
 */
export {
  demoUser,
  demoGrowth,
  demoMilestones,
  demoGoals,
  demoPlans,
  demoAttendance,
  demoFocusMonitor,
  demoFocusMonitorDistracted,
  demoSettlement,
  demoDailyReport,
  demoSettlementVariants,
} from './demo-data';

export type { DailyReportView } from './demo-data';
