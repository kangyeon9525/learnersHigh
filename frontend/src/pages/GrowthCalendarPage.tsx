import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../stores/useAppStore';
import { stageLabel } from '../utils/format';
import './GrowthCalendarPage.css';

type CalendarView = 'lifetime' | 'monthly';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

interface DayCell {
  day: number | null;
  scoreDelta?: number;
  stage?: number;
}

function buildCalendar(month: string, history: { date: string; scoreDelta: number; stage: number }[]): DayCell[] {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const byDay = new Map<number, { scoreDelta: number; stage: number }>();
  for (const entry of history) {
    if (entry.date.startsWith(month)) {
      byDay.set(Number(entry.date.slice(8, 10)), { scoreDelta: entry.scoreDelta, stage: entry.stage });
    }
  }

  const cells: DayCell[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d += 1) {
    const hit = byDay.get(d);
    cells.push({ day: d, scoreDelta: hit?.scoreDelta, stage: hit?.stage });
  }
  return cells;
}

/** 성장 캘린더 드릴다운 (P1.6.4 셸). TODO(P3.1.5): /api/growth/:id/history 연동 */
export function GrowthCalendarPage() {
  const growth = useAppStore((s) => s.growth);
  const [view, setView] = useState<CalendarView>('lifetime');

  if (!growth) {
    return (
      <p className="muted" data-testid="growth-calendar-loading">
        성장 데이터를 불러오는 중…
      </p>
    );
  }

  const month = growth.monthly.currentMonth;
  const cells = buildCalendar(month, growth.lifetime.history);
  const monthHistory = growth.lifetime.history.filter((h) => h.date.startsWith(month));

  return (
    <div className="growth-calendar" data-testid="growth-calendar">
      <header className="growth-calendar__head">
        <div>
          <Link to="/growth" className="growth-calendar__back" data-testid="back-growth">
            ← 성장 정원
          </Link>
          <h2>성장 캘린더</h2>
        </div>
        <div className="timer-mode" role="tablist" aria-label="캘린더 보기">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'lifetime'}
            className={`timer-mode__btn${view === 'lifetime' ? ' timer-mode__btn--active' : ''}`}
            onClick={() => setView('lifetime')}
            data-testid="calendar-lifetime"
          >
            누적 나무
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'monthly'}
            className={`timer-mode__btn${view === 'monthly' ? ' timer-mode__btn--active' : ''}`}
            onClick={() => setView('monthly')}
            data-testid="calendar-monthly"
          >
            월간 화분
          </button>
        </div>
      </header>

      <div className="growth-calendar__layout">
        <Card title={`${month} 성장 기록`}>
          <div className="growth-calendar__grid" data-testid="calendar-grid">
            {WEEKDAYS.map((w) => (
              <span key={w} className="growth-calendar__weekday">
                {w}
              </span>
            ))}
            {cells.map((cell, idx) => (
              <div
                key={idx}
                className={`growth-calendar__cell${cell.scoreDelta ? ' growth-calendar__cell--active' : ''}${cell.day ? '' : ' growth-calendar__cell--empty'}`}
              >
                {cell.day ? (
                  <>
                    <span className="growth-calendar__day">{cell.day}</span>
                    {cell.scoreDelta ? (
                      <span className="growth-calendar__dot" title={`+${cell.scoreDelta}점`} />
                    ) : null}
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </Card>

        <Card title={view === 'lifetime' ? '누적 성장 이력' : '월간 화분 아카이브'}>
          {view === 'lifetime' ? (
            <ul className="growth-calendar__history" data-testid="calendar-history">
              {monthHistory.length === 0 ? (
                <li className="muted">이번 달 기록이 없습니다.</li>
              ) : (
                monthHistory.map((h) => (
                  <li key={h.date}>
                    <span>{h.date}</span>
                    <span>+{h.scoreDelta}점</span>
                    <span className="muted">{stageLabel(h.stage)}</span>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <ul className="growth-calendar__history" data-testid="calendar-archive">
              {growth.monthly.archive.map((a) => (
                <li key={a.month}>
                  <span>{a.month}</span>
                  <span>{a.totalScore}점</span>
                  <span className="muted">{stageLabel(a.finalStage)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
