import { useEffect, useState } from 'react';
import type { DailyReport } from '@learners-high/shared';
import { Card } from '../components/ui/Card';
import { PageState } from '../components/ui/PageState';
import { fetchDailyReport } from '../api/reports';
import { useAppStore } from '../stores/useAppStore';
import { demoDailyReport, type DailyReportView } from '../fixtures/demo-data';
import './DailyReportPage.css';

const SUBJECT_COLORS = ['#8b5cf6', '#22c55e', '#eab308', '#3b82f6', '#f43f5e'];

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** DailyReport API 응답 → DailyReportView 변환 */
function mapApiToView(report: DailyReport): DailyReportView {
  const date = new Date(report.date + 'T00:00:00');
  const dateLabel = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const timeline: DailyReportView['timeline'] = [];
  if (report.checkInAt) {
    timeline.push({ kind: 'check', time: formatTime(report.checkInAt), title: '입실' });
  }
  for (const s of report.sessions) {
    timeline.push({
      kind: 'study',
      time: `${formatTime(s.startedAt)} - ${formatTime(s.endedAt)}`,
      title: '학습 세션',
      durationLabel: formatMinutes(s.focusMinutes),
      rating: s.satisfaction,
    });
  }
  if (report.checkOutAt) {
    timeline.push({ kind: 'check', time: formatTime(report.checkOutAt), title: '퇴실' });
  }

  const subjects: DailyReportView['subjects'] =
    report.sessions.length > 0
      ? report.sessions.map((s, i) => ({
          label: `세션 ${i + 1}`,
          ratio: report.totalFocusMinutes > 0
            ? Math.round((s.focusMinutes / report.totalFocusMinutes) * 100)
            : 0,
          color: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
        }))
      : [{ label: '학습', ratio: 100, color: SUBJECT_COLORS[0] }];

  const efficiency = report.focusEfficiency;
  const growthComment =
    report.earnedScore > 0
      ? `오늘 ${report.earnedScore}점을 획득해 나무가 자랐습니다.`
      : '오늘 학습 기록을 작성하면 나무가 자랍니다.';
  const comment =
    report.totalFocusMinutes > 0
      ? `총 ${formatMinutes(report.totalFocusMinutes)} 집중했어요. 효율 ${efficiency}%!`
      : '오늘 완료된 학습 세션이 없습니다.';

  return {
    date: report.date,
    dateLabel,
    timeline,
    totalFocusLabel: formatMinutes(report.totalFocusMinutes),
    subjects,
    focusEfficiency: efficiency,
    achievedBadgeCount: 0,
    comment,
    growthComment,
  };
}

function ratingStars(rating?: number): string {
  if (!rating) return '';
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function donutGradient(report: DailyReportView): string {
  let acc = 0;
  const stops = report.subjects.map((s) => {
    const start = acc;
    acc += s.ratio;
    return `${s.color} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

/** P3.5: 데일리 리포트 — GET /api/reports/daily/:userId 연동 */
export function DailyReportPage() {
  const userId = useAppStore((s) => s.userId);
  const dataSource = useAppStore((s) => s.dataSource);
  const [report, setReport] = useState<DailyReportView>(demoDailyReport);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId || dataSource !== 'live') {
      setReport(demoDailyReport);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    fetchDailyReport(userId, todayStr())
      .then((data) => {
        setReport(mapApiToView(data));
      })
      .catch(() => {
        setReport(demoDailyReport);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [userId, dataSource]);

  if (loading) {
    return <PageState variant="loading" title="리포트를 불러오는 중" testId="daily-report-loading" />;
  }

  return (
    <div className="daily-report" data-testid="daily-report">
      {error && (
        <p className="muted" style={{ padding: '0 0 8px' }}>
          서버 연결 실패 — 데모 데이터를 표시합니다.
        </p>
      )}
      <header className="daily-report__head">
        <p className="daily-report__date">{report.dateLabel}</p>
        <h2>오늘의 학습 리포트</h2>
      </header>

      <div className="daily-report__layout">
        <Card className="daily-report__timeline-card" title="📋 학습 타임라인">
          <ol className="daily-report__timeline" data-testid="report-timeline">
            {report.timeline.map((entry, idx) => (
              <li
                key={idx}
                className={`daily-report__entry daily-report__entry--${entry.kind}`}
              >
                <span className="daily-report__time">{entry.time}</span>
                {entry.kind === 'check' ? (
                  <span className="daily-report__check">{entry.title}</span>
                ) : (
                  <div className="daily-report__study">
                    <div>
                      <strong>{entry.title}</strong>
                      {entry.subtitle ? <small>{entry.subtitle}</small> : null}
                      {entry.rating ? (
                        <span className="daily-report__stars">{ratingStars(entry.rating)}</span>
                      ) : null}
                    </div>
                    {entry.durationLabel ? (
                      <span className="daily-report__duration">{entry.durationLabel}</span>
                    ) : null}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </Card>

        <div className="daily-report__side">
          <Card className="daily-report__focus">
            <p className="daily-report__focus-eyebrow">총 순공 시간</p>
            <p className="daily-report__focus-total">{report.totalFocusLabel}</p>
            <div
              className="daily-report__donut"
              style={{ background: donutGradient(report) }}
              role="img"
              aria-label="과목별 학습 비율"
            >
              <span className="daily-report__donut-hole" aria-hidden>
                ✿
              </span>
            </div>
            <ul className="daily-report__legend">
              {report.subjects.map((s) => (
                <li key={s.label}>
                  <span className="daily-report__legend-dot" style={{ background: s.color }} />
                  {s.label} {s.ratio}%
                </li>
              ))}
            </ul>
          </Card>

          <div className="daily-report__stats">
            <Card className="daily-report__stat">
              <span aria-hidden>⚡</span>
              <small className="muted">순공 효율</small>
              <strong>{report.focusEfficiency}%</strong>
            </Card>
            <Card className="daily-report__stat">
              <span aria-hidden>🏅</span>
              <small className="muted">달성 뱃지</small>
              <strong data-testid="report-badge-count">{report.achievedBadgeCount}개</strong>
            </Card>
          </div>
        </div>
      </div>

      <div className="daily-report__notes">
        <Card title="오늘의 한마디">
          <p className="daily-report__comment">{report.comment}</p>
        </Card>
        <Card className="daily-report__growth-note">
          <strong>오늘 나무가 자랐어요 🌱</strong>
          <p>{report.growthComment}</p>
        </Card>
      </div>
    </div>
  );
}
