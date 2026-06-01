import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIn } from '../api/attendance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlanList } from '../components/plans/PlanList';
import { AttendanceModal } from '../components/attendance/AttendanceModal';
import {
  demoAttendance,
  demoFocusMonitor,
} from '../fixtures/demo-data';
import { useAppStore } from '../stores/useAppStore';
import { stageBadgeLabel, stageLabel } from '../utils/format';
import './HomePage.css';

function todayLabel(): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());
}

export function HomePage() {
  const name = useAppStore((s) => s.displayName);
  const growth = useAppStore((s) => s.growth);
  const plans = useAppStore((s) => s.plans);
  const goals = useAppStore((s) => s.goals);
  const userId = useAppStore((s) => s.userId);
  const setAttendance = useAppStore((s) => s.setAttendance);
  const setFocusMonitor = useAppStore((s) => s.setFocusMonitor);
  const dataSource = useAppStore((s) => s.dataSource);
  const navigate = useNavigate();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const handleCheckIn = async () => {
    if (!userId) return;
    setCheckingIn(true);
    try {
      const res = await checkIn({ userId });
      setAttendance(res.attendance);
      setFocusMonitor(res.focusMonitor);
    } catch {
      const now = new Date().toISOString();
      setAttendance({
        ...demoAttendance,
        userId,
        checkInAt: now,
        focusMonitoring: {
          enabled: true,
          currentStatus: 'focus',
          currentFrameId: 'focus-desk-1',
          startedAt: now,
        },
      });
      setFocusMonitor({
        ...demoFocusMonitor,
        displayMode: 'standby',
        monitoringSince: now,
        attendanceId: `local-att-${Date.now()}`,
      });
      if (dataSource === 'live') {
        useAppStore.getState().setDataSource('fixture');
      }
    } finally {
      setCheckingIn(false);
      setCheckInOpen(false);
      navigate('/timer');
    }
  };

  const dailyGoals = goals.filter((g) => g.cycle === 'daily');
  const newAchievement = useAppStore((s) => s.milestones).find((m) => m.isAchieved);

  return (
    <div className="home-page" data-testid="home-page">
      <header className="home-page__header">
        <div>
          <h2 className="home-page__greeting">안녕하세요, {name || '학습자'}님 👋</h2>
          <p className="muted">{todayLabel()}</p>
        </div>
        <Button variant="secondary" onClick={() => setCheckInOpen(true)} data-testid="home-check-in">
          ☀ 체크인하기
        </Button>
      </header>

      <div className="home-page__grid">
        <Card className="home-page__plan" title="오늘의 학습 계획">
          <PlanList plans={plans} />
          <Button
            variant="primary"
            className="home-page__start"
            onClick={() => navigate('/timer')}
            data-testid="home-start-study"
          >
            학습 시작하기 →
          </Button>
        </Card>

        <Card className="home-page__growth">
          <div className="home-page__growth-head">
            <span>성장 정원</span>
            {growth ? (
              <span className="home-page__stage-badge" data-testid="home-stage-badge">
                {stageBadgeLabel(growth.lifetime.currentStage)}
              </span>
            ) : null}
          </div>
          <p className="muted">노력이 뿌리내리고 있어요. 계속 힘내세요!</p>
          <button
            type="button"
            className="home-page__garden-scene"
            onClick={() => navigate('/growth')}
            data-testid="home-go-growth"
            aria-label="성장 정원으로 이동"
          >
            <div className={`tree tree--stage-${growth?.lifetime.currentStage ?? 1}`} />
          </button>
          {growth ? (
            <div className="home-page__monthly">
              <span className="home-page__monthly-icon" aria-hidden>
                ✿
              </span>
              <div>
                <strong>이번 달 화분 · {stageLabel(growth.monthly.currentStage)}</strong>
                <small>{growth.monthly.totalScore}점 적립</small>
              </div>
              <span aria-hidden>›</span>
            </div>
          ) : null}
        </Card>

        <div className="home-page__side">
          <Card title="오늘의 퀘스트" data-testid="home-quests">
            {dailyGoals.length === 0 ? (
              <p className="muted">오늘 배정된 퀘스트가 없습니다.</p>
            ) : (
              <ul className="quest-list">
                {dailyGoals.map((goal) => {
                  const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                  return (
                    <li key={goal.id} className="quest-list__item">
                      <div className="quest-list__row">
                        <span>{goal.targetValue}분 목표</span>
                        <span className="muted">
                          {goal.currentValue}/{goal.targetValue}
                        </span>
                      </div>
                      <div className="quest-bar" role="progressbar" aria-valuenow={pct}>
                        <span style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card className="home-page__achievement">
            {newAchievement ? (
              <div className="home-page__achievement-body">
                <span className="home-page__achievement-icon" aria-hidden>
                  🏅
                </span>
                <strong>{newAchievement.title}</strong>
                <small className="muted">최근 달성 성취</small>
              </div>
            ) : (
              <div className="home-page__achievement-body home-page__achievement-body--empty">
                <span className="home-page__achievement-icon" aria-hidden>
                  🪴
                </span>
                <strong>새로운 성취가 없어요</strong>
                <small className="muted">다음 목표를 향해 나아가 보세요</small>
              </div>
            )}
          </Card>
        </div>
      </div>

      <AttendanceModal
        open={checkInOpen}
        mode="check-in"
        onClose={() => setCheckInOpen(false)}
        onCheckIn={handleCheckIn}
        confirmLoading={checkingIn}
      />
    </div>
  );
}
