import { Card } from '../components/ui/Card';
import { demoDailyReport, type DailyReportView } from '../fixtures/demo-data';
import './DailyReportPage.css';

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

/**
 * 데일리 리포트 (P1.8 UI 셸).
 * TODO(P3.5): demoDailyReport를 `GET /api/reports/daily/:userId` aggregation 응답으로 대체.
 */
export function DailyReportPage() {
  const report = demoDailyReport;

  return (
    <div className="daily-report" data-testid="daily-report">
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
              <strong>{report.achievedBadgeCount}개</strong>
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
