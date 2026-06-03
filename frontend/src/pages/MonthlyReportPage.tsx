import { useEffect, useMemo, useState } from 'react';
import type { MonthlyReport } from '@learners-high/shared';
import { Card } from '../components/ui/Card';
import { PageState } from '../components/ui/PageState';
import { fetchMonthlyReport } from '../api/reports';
import { useAppStore } from '../stores/useAppStore';
import { stageLabel } from '../utils/format';
import { demoMonthlyReport } from '../fixtures/demo-data';
import './MonthlyReportPage.css';

// ── 히트맵 5단계 색상 (focus minutes 기준) ──────────────────
const HEATMAP_LEVELS = [
  { min: 0,   max: 0,   bg: 'var(--hm-0)', label: '학습 없음' },
  { min: 1,   max: 30,  bg: 'var(--hm-1)', label: '~30분' },
  { min: 31,  max: 60,  bg: 'var(--hm-2)', label: '~1시간' },
  { min: 61,  max: 120, bg: 'var(--hm-3)', label: '~2시간' },
  { min: 121, max: Infinity, bg: 'var(--hm-4)', label: '2시간+' },
] as const;

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function heatColor(minutes: number): string {
  for (const l of HEATMAP_LEVELS) {
    if (minutes <= l.max) return l.bg;
  }
  return HEATMAP_LEVELS[4].bg;
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}

function prevMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function nextMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function isCurrentMonth(month: string): boolean {
  return month === new Date().toISOString().slice(0, 7);
}
function monthLabel(month: string): string {
  const [y, m] = month.split('-');
  return `${y}년 ${Number(m)}월`;
}

// ── 히트맵 달력 셀 배열 생성 ─────────────────────────────────
interface CalCell { day: number | null; focusMinutes: number; sessionCount: number; earnedScore: number }

function buildCalendarCells(month: string, days: MonthlyReport['days']): CalCell[] {
  const [y, m] = month.split('-').map(Number);
  const firstWeekday = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  const byDay = new Map(
    days.map((d) => [Number(d.date.slice(8)), d]),
  );
  const cells: CalCell[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ day: null, focusMinutes: 0, sessionCount: 0, earnedScore: 0 });
  for (let d = 1; d <= daysInMonth; d++) {
    const data = byDay.get(d);
    cells.push({
      day: d,
      focusMinutes: data?.focusMinutes ?? 0,
      sessionCount: data?.sessionCount ?? 0,
      earnedScore: data?.earnedScore ?? 0,
    });
  }
  return cells;
}

// ── 도넛 차트 (CSS conic-gradient) ───────────────────────────
function DonutChart({ pct, label, sub }: { pct: number; label: string; sub: string }) {
  const grad = `conic-gradient(var(--color-accent-strong) 0% ${pct}%, var(--color-border-muted) ${pct}% 100%)`;
  return (
    <div className="mr-donut-wrap">
      <div
        className="mr-donut"
        style={{ background: grad }}
        role="img"
        aria-label={`${label}: ${pct}%`}
        data-testid="monthly-donut"
      >
        <div className="mr-donut__hole">
          <strong className="mr-donut__pct">{pct}%</strong>
          <span className="mr-donut__label">{label}</span>
        </div>
      </div>
      <p className="mr-donut__sub muted">{sub}</p>
    </div>
  );
}

/** P4.2: 월간 리포트 UI 고도화 — 히트맵·도넛·바 차트·월 네비게이션 */
export function MonthlyReportPage() {
  const userId = useAppStore((s) => s.userId);
  const dataSource = useAppStore((s) => s.dataSource);
  const growth = useAppStore((s) => s.growth);

  const [selectedMonth, setSelectedMonth] = useState<string>(
    () => new Date().toISOString().slice(0, 7),
  );
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) {
      setReport(demoMonthlyReport);
      setLoading(false);
      return;
    }
    if (dataSource !== 'live') {
      setReport(demoMonthlyReport);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    fetchMonthlyReport(userId, selectedMonth)
      .then((data) => {
        // 데이터가 없으면 fixture로 폴백
        if (data.totalSessions === 0 && data.activeDays === 0) {
          setReport(demoMonthlyReport);
        } else {
          setReport(data);
        }
      })
      .catch(() => {
        setReport(demoMonthlyReport);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [userId, dataSource, selectedMonth]);

  const cells = useMemo(
    () => (report ? buildCalendarCells(report.month, report.days) : []),
    [report],
  );

  const maxFocus = useMemo(
    () => Math.max(...(report?.days.map((d) => d.focusMinutes) ?? [1]), 1),
    [report],
  );

  if (loading) {
    return <PageState variant="loading" title="월간 리포트를 불러오는 중" testId="monthly-report-loading" />;
  }
  if (!report) {
    return <PageState variant="empty" title="월간 데이터가 없습니다" testId="monthly-report-empty" />;
  }

  const currentStage = report.growthArchive?.finalStage ?? growth?.monthly.currentStage ?? 0;

  return (
    <div className="monthly-report" data-testid="monthly-report">
      {/* 헤더 + 월 네비게이션 */}
      <header className="monthly-report__head">
        <div>
          <p className="monthly-report__eyebrow">학습 리포트</p>
          <h2>{monthLabel(report.month)}</h2>
        </div>
        <nav className="monthly-report__nav" aria-label="월 이동">
          <button
            type="button"
            className="monthly-report__nav-btn"
            onClick={() => setSelectedMonth(prevMonth(selectedMonth))}
            data-testid="month-prev"
          >
            ← 이전달
          </button>
          <button
            type="button"
            className="monthly-report__nav-btn"
            disabled={isCurrentMonth(selectedMonth)}
            onClick={() => setSelectedMonth(nextMonth(selectedMonth))}
            data-testid="month-next"
          >
            다음달 →
          </button>
        </nav>
      </header>

      {error && (
        <p className="muted monthly-report__error-banner">
          서버 연결 실패 — 데모 데이터를 표시합니다.
        </p>
      )}

      {/* KPI 4종 */}
      <div className="monthly-report__kpi" data-testid="monthly-kpi">
        <Card className="monthly-report__kpi-card">
          <span className="monthly-report__kpi-icon" aria-hidden>⏱</span>
          <small className="muted">총 순공 시간</small>
          <strong className="monthly-report__kpi-val" data-testid="monthly-total-focus">
            {formatMinutes(report.totalFocusMinutes)}
          </strong>
        </Card>
        <Card className="monthly-report__kpi-card">
          <span className="monthly-report__kpi-icon" aria-hidden>📚</span>
          <small className="muted">총 세션 수</small>
          <strong className="monthly-report__kpi-val" data-testid="monthly-total-sessions">
            {report.totalSessions}회
          </strong>
        </Card>
        <Card className="monthly-report__kpi-card">
          <span className="monthly-report__kpi-icon" aria-hidden>📅</span>
          <small className="muted">학습 일수</small>
          <strong className="monthly-report__kpi-val" data-testid="monthly-active-days">
            {report.activeDays}일
          </strong>
        </Card>
        <Card className="monthly-report__kpi-card">
          <span className="monthly-report__kpi-icon" aria-hidden>⚡</span>
          <small className="muted">평균 집중 효율</small>
          <strong className="monthly-report__kpi-val">{report.focusEfficiency}%</strong>
        </Card>
      </div>

      {/* 메인 2컬럼 */}
      <div className="monthly-report__body">
        {/* 왼쪽: 히트맵 캘린더 */}
        <Card title="순공 히트맵" className="monthly-report__heatmap-card">
          {/* 범례 */}
          <div className="monthly-report__legend" aria-label="히트맵 범례">
            {HEATMAP_LEVELS.map((l) => (
              <span key={l.label} className="monthly-report__legend-item">
                <span className="monthly-report__legend-dot" style={{ background: l.bg }} />
                <span className="monthly-report__legend-text">{l.label}</span>
              </span>
            ))}
          </div>

          {/* 요일 헤더 */}
          <div className="monthly-report__heatmap-grid" data-testid="monthly-heatmap">
            {WEEKDAY_LABELS.map((w) => (
              <span key={w} className="monthly-report__heatmap-weekday">{w}</span>
            ))}
            {cells.map((cell, idx) => (
              <div
                key={idx}
                className={`monthly-report__heatmap-cell${cell.day ? '' : ' monthly-report__heatmap-cell--empty'}`}
                style={cell.day ? { background: heatColor(cell.focusMinutes) } : undefined}
                title={
                  cell.day && cell.focusMinutes > 0
                    ? `${report.month}-${String(cell.day).padStart(2, '0')}: ${formatMinutes(cell.focusMinutes)}, ${cell.sessionCount}세션, +${cell.earnedScore}점`
                    : cell.day
                    ? `${report.month}-${String(cell.day).padStart(2, '0')}: 학습 없음`
                    : undefined
                }
              >
                {cell.day ? (
                  <span className="monthly-report__heatmap-day">{cell.day}</span>
                ) : null}
              </div>
            ))}
          </div>
        </Card>

        {/* 오른쪽: 도넛 + 성장 요약 */}
        <div className="monthly-report__side">
          {/* 도넛 차트 — 집중 효율 */}
          <Card title="집중 효율" className="monthly-report__donut-card">
            <DonutChart
              pct={report.focusEfficiency}
              label="집중률"
              sub={`일 평균 ${formatMinutes(report.avgFocusMinutesPerDay)} 순공`}
            />
          </Card>

          {/* 성장 요약 카드 */}
          <Card title="이달 성장" className="monthly-report__growth-card" data-testid="monthly-growth-summary">
            <ul className="monthly-report__growth-list">
              <li>
                <span className="muted">획득 점수</span>
                <strong className="monthly-report__score">+{report.totalEarnedScore}점</strong>
              </li>
              <li>
                <span className="muted">화분 단계</span>
                <strong>{stageLabel(currentStage)}</strong>
              </li>
              <li>
                <span className="muted">최고 기록</span>
                <strong>{formatMinutes(maxFocus)}</strong>
              </li>
            </ul>
            {/* 달성률 바 */}
            <div className="monthly-report__progress-wrap">
              <div className="monthly-report__progress-head">
                <span className="muted">월간 목표 달성률</span>
                <strong>{Math.min(100, Math.round((report.totalFocusMinutes / 3000) * 100))}%</strong>
              </div>
              <div className="quest-bar" role="progressbar">
                <span style={{ width: `${Math.min(100, Math.round((report.totalFocusMinutes / 3000) * 100))}%` }} />
              </div>
              <small className="muted">목표: 50시간 (3,000분)</small>
            </div>
          </Card>
        </div>
      </div>

      {/* 하단: 일별 바 차트 */}
      {report.days.length > 0 && (
        <Card title="일별 순공 시간" className="monthly-report__bar-card">
          <div className="monthly-report__bar-chart" data-testid="monthly-bar-chart">
            {report.days.map((d) => {
              const pct = Math.round((d.focusMinutes / maxFocus) * 100);
              const dayNum = Number(d.date.slice(8));
              return (
                <div key={d.date} className="monthly-report__bar-item">
                  <span className="monthly-report__bar-tooltip">
                    {formatMinutes(d.focusMinutes)}
                  </span>
                  <div
                    className="monthly-report__bar"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                    title={`${d.date}: ${formatMinutes(d.focusMinutes)}`}
                  />
                  <span className="monthly-report__bar-label">{dayNum}일</span>
                </div>
              );
            })}
          </div>
          <p className="muted monthly-report__bar-hint">
            최고: {formatMinutes(maxFocus)} · 평균: {formatMinutes(report.avgFocusMinutesPerDay)}
          </p>
        </Card>
      )}
    </div>
  );
}
