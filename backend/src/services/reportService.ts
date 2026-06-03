import type { BranchRanking, DailyReport, MonthlyReport, MonthlyReportDay, RankingEntry } from '@learners-high/shared';
import { AttendanceModel, GrowthStateModel, StudySessionModel, UserModel } from '../db/models/index.js';

const SESSION_BASE_SCORE_PER_MINUTE = 2;

export async function getDailyReport(userId: string, date: string): Promise<DailyReport> {
  // date: YYYY-MM-DD
  const dayStart = `${date}T00:00:00.000Z`;
  const dayEnd = `${date}T23:59:59.999Z`;

  // 당일 완료 세션 조회
  const sessionDocs = await StudySessionModel.find({
    userId,
    completed: true,
    startedAt: { $gte: dayStart, $lte: dayEnd },
  }).sort({ startedAt: 1 });

  // 당일 출결 조회 (가장 최근)
  const attendanceDoc = await AttendanceModel.findOne({
    userId,
    checkInAt: { $gte: dayStart, $lte: dayEnd },
  }).sort({ checkInAt: -1 });

  const sessions = sessionDocs.map((s) => ({
    sessionId: s._id.toString(),
    startedAt: s.startedAt,
    endedAt: s.endedAt ?? s.startedAt,
    focusMinutes: s.focusMinutes ?? 0,
    satisfaction: s.satisfaction as DailyReport['sessions'][0]['satisfaction'],
    progress: s.progress as DailyReport['sessions'][0]['progress'],
  }));

  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.focusMinutes, 0);

  // 총 경과 시간(분) 계산
  const totalDurationMinutes = sessions.reduce((acc, s) => {
    const start = new Date(s.startedAt).getTime();
    const end = new Date(s.endedAt).getTime();
    return acc + Math.max(0, Math.round((end - start) / 60_000));
  }, 0);

  const focusEfficiency =
    totalDurationMinutes > 0
      ? Math.min(100, Math.round((totalFocusMinutes / totalDurationMinutes) * 100))
      : 0;

  const earnedScore = totalFocusMinutes * SESSION_BASE_SCORE_PER_MINUTE;

  return {
    date,
    userId,
    checkInAt: attendanceDoc?.checkInAt ?? undefined,
    checkOutAt: attendanceDoc?.checkOutAt ?? undefined,
    sessions,
    totalFocusMinutes,
    totalDurationMinutes,
    focusEfficiency,
    earnedScore,
  };
}

/** P4.1: 월간 리포트 — 월별 세션 aggregation */
export async function getMonthlyReport(userId: string, month: string): Promise<MonthlyReport> {
  // month: YYYY-MM
  const year = Number(month.slice(0, 4));
  const mon = Number(month.slice(5, 7));
  const lastDay = new Date(year, mon, 0).getDate(); // 다음 달 0일 = 이번 달 마지막 날
  const monthStart = `${month}-01T00:00:00.000Z`;
  const monthEnd = `${month}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`;

  const sessionDocs = await StudySessionModel.find({
    userId,
    completed: true,
    startedAt: { $gte: monthStart, $lte: monthEnd },
  }).sort({ startedAt: 1 });

  // 일별 집계
  const dayMap = new Map<string, { focusMinutes: number; sessionCount: number; earnedScore: number }>();
  for (const s of sessionDocs) {
    const date = s.startedAt.slice(0, 10);
    const entry = dayMap.get(date) ?? { focusMinutes: 0, sessionCount: 0, earnedScore: 0 };
    const focusMin = s.focusMinutes ?? 0;
    entry.focusMinutes += focusMin;
    entry.sessionCount += 1;
    entry.earnedScore += focusMin * SESSION_BASE_SCORE_PER_MINUTE;
    dayMap.set(date, entry);
  }

  const days: MonthlyReportDay[] = Array.from(dayMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalFocusMinutes = days.reduce((acc, d) => acc + d.focusMinutes, 0);
  const totalSessions = days.reduce((acc, d) => acc + d.sessionCount, 0);
  const totalEarnedScore = days.reduce((acc, d) => acc + d.earnedScore, 0);
  const activeDays = days.length;
  const avgFocusMinutesPerDay = activeDays > 0 ? Math.round(totalFocusMinutes / activeDays) : 0;

  const totalDurationMinutes = sessionDocs.reduce((acc, s) => {
    const start = new Date(s.startedAt).getTime();
    const end = new Date(s.endedAt ?? s.startedAt).getTime();
    return acc + Math.max(0, Math.round((end - start) / 60_000));
  }, 0);
  const focusEfficiency =
    totalDurationMinutes > 0
      ? Math.min(100, Math.round((totalFocusMinutes / totalDurationMinutes) * 100))
      : 0;

  // 성장 아카이브에서 해당 월 데이터 조회
  const growthDoc = await GrowthStateModel.findOne({ userId });
  const archiveEntry = growthDoc?.monthly?.archive?.find((a) => a.month === month);
  const growthArchive = archiveEntry
    ? { totalScore: archiveEntry.totalScore ?? 0, finalStage: archiveEntry.finalStage ?? 0 }
    : undefined;

  return {
    month,
    userId,
    totalFocusMinutes,
    totalSessions,
    totalEarnedScore,
    avgFocusMinutesPerDay,
    activeDays,
    focusEfficiency,
    days,
    growthArchive,
  };
}

/** P4.3: 지점 가상 순위 — 같은 branchId 사용자들의 이번 달 growthState 기준 집계 */
export async function getBranchRanking(userId: string, branchId: string, month: string): Promise<BranchRanking> {
  const branchUsers = await UserModel.find({ branchId });
  if (branchUsers.length === 0) {
    return { branchId, month, entries: [], currentUserRank: undefined };
  }

  const userObjectIds = branchUsers.map((u) => u._id);
  const growthDocs = await GrowthStateModel.find({ userId: { $in: userObjectIds } });

  const entries: RankingEntry[] = growthDocs.map((g) => {
    const uidStr = g.userId.toString();
    const user = branchUsers.find((u) => u._id.toString() === uidStr);
    const monthly = g.monthly ?? null;
    const isCurrentMonth = monthly?.currentMonth === month;
    const monthlyScore = isCurrentMonth
      ? (monthly?.totalScore ?? 0)
      : (monthly?.archive?.find((a) => a.month === month)?.totalScore ?? 0);
    return {
      rank: 0,
      userId: uidStr,
      displayName: user?.displayName ?? '학생',
      monthlyScore,
      currentStage: isCurrentMonth ? (monthly?.currentStage ?? 0) : 0,
      isCurrentUser: uidStr === userId,
    };
  });

  entries.sort((a, b) => b.monthlyScore - a.monthlyScore);
  entries.forEach((e, i) => { e.rank = i + 1; });

  const currentUserRank = entries.find((e) => e.isCurrentUser)?.rank;
  return { branchId, month, entries, currentUserRank };
}
