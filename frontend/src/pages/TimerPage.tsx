import { useEffect, useRef, useState } from 'react';
import type { StudySession } from '@learners-high/shared';
import { fetchFocusMonitorState } from '../api/focusMonitor';
import {
  abandonActiveSessions,
  endStudySession,
  injectAiEvent,
  startStudySession,
} from '../api/study';
import { WebcamMonitorPanel } from '../components/focus-monitor/WebcamMonitorPanel';
import {
  demoFocusMonitorDistracted,
  demoSettlement,
} from '../fixtures/demo-data';
import { fetchGoals, fetchGrowth, fetchMilestones } from '../api/growth';
import { AlertBanner } from '../components/feedback/AlertBanner';
import { TimerDisplay } from '../components/timer/TimerDisplay';
import { TimerModeToggle, type TimerMode } from '../components/timer/TimerModeToggle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageState } from '../components/ui/PageState';
import { useAppStore } from '../stores/useAppStore';
import {
  buildLocalMonitorState,
  resolveTimerDisplayMode,
} from '../utils/focusMonitorFrames';
import { syncTimerHydration } from '../utils/syncTimerHydration';
import './TimerPage.css';

type Score = 1 | 2 | 3 | 4 | 5;

const COUNTDOWN_SECONDS = 25 * 60;

export function TimerPage() {
  const userId = useAppStore((s) => s.userId);
  const dataSource = useAppStore((s) => s.dataSource);
  const attendance = useAppStore((s) => s.attendance);
  const setAttendance = useAppStore((s) => s.setAttendance);
  const focusMonitor = useAppStore((s) => s.focusMonitor);
  const setFocusMonitor = useAppStore((s) => s.setFocusMonitor);
  const activeSession = useAppStore((s) => s.activeSession);
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const openSettlement = useAppStore((s) => s.openSettlement);
  const setGrowth = useAppStore((s) => s.setGrowth);
  const setMilestones = useAppStore((s) => s.setMilestones);
  const setGoals = useAppStore((s) => s.setGoals);

  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [seconds, setSeconds] = useState(0);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [distracted, setDistracted] = useState(false);
  const [satisfaction, setSatisfaction] = useState<Score>(4);
  const [progress, setProgress] = useState<Score>(4);
  const [ending, setEnding] = useState(false);
  const [monitorEnded, setMonitorEnded] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const distractedRef = useRef(false);

  const checkedIn = attendance?.status === 'checked_in';
  const displayMode = resolveTimerDisplayMode(
    checkedIn,
    !!activeSession,
    monitorEnded,
  );

  /** setInterval 콜백이 최신 이탈 상태를 읽도록 ref 동기화 */
  useEffect(() => {
    distractedRef.current = distracted;
  }, [distracted]);

  /** 새로고침·진입 시 입실·세션·모니터 동기화 (유령 세션 정리 포함) */
  useEffect(() => {
    if (!userId) {
      setHydrating(false);
      return;
    }
    let cancelled = false;
    setHydrating(true);

    void (async () => {
      try {
        if (dataSource === 'live') {
          const { attendance: att, session, focusMonitor: monitor } =
            await syncTimerHydration(userId);
          if (cancelled) return;
          setAttendance(att);
          setActiveSession(session);
          setMonitorEnded(false);
          setFocusMonitor(monitor);
          if (session) {
            setDistracted(monitor?.status === 'distracted');
            setRunning(false);
          }
        }
      } catch {
        /* fixture: bootstrap/store 값 유지 */
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, dataSource, setAttendance, setActiveSession, setFocusMonitor]);

  /** 타이머: 전체 시간은 항상 증가, 집중 시간은 이탈 중에는 적립하지 않는다 */
  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds((prev) => (mode === 'timer' ? Math.max(0, prev - 1) : prev + 1));
      if (!distractedRef.current) setFocusSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  /** 서버 플래그: 연속 이탈 N회 시 인라인 경고 유지 */
  useEffect(() => {
    if (activeSession?.focusAlertTriggered) setDistracted(true);
  }, [activeSession?.focusAlertTriggered]);

  /** mock-ai 폴링: 이탈/집중 상태를 경고에 반영 (타이머는 멈추지 않음) */
  useEffect(() => {
    if (!userId || !checkedIn || !activeSession || dataSource !== 'live') return;

    const poll = async () => {
      try {
        const state = await fetchFocusMonitorState(userId);
        setFocusMonitor(state);
        if (state.displayMode === 'live') {
          setDistracted(state.status === 'distracted');
        }
      } catch {
        /* ignore */
      }
    };

    void poll();
    const id = window.setInterval(() => void poll(), 4000);
    return () => clearInterval(id);
  }, [userId, checkedIn, activeSession, dataSource, setFocusMonitor]);

  const refreshMonitorFromApi = async () => {
    if (!userId) return;
    try {
      const state = await fetchFocusMonitorState(userId);
      setFocusMonitor(state);
    } catch {
      setFocusMonitor(buildLocalMonitorState('live', 'focus', 0));
    }
  };

  const handleStart = async () => {
    if (!userId) return;
    setMonitorEnded(false);
    const startedAt = new Date().toISOString();
    let session: StudySession;
    try {
      session = await startStudySession({ userId, startedAt });
      await refreshMonitorFromApi();
    } catch {
      session = {
        id: `local-${Date.now()}`,
        userId,
        startedAt,
        endedAt: startedAt,
        focusMinutes: 0,
        satisfaction: 4,
        completed: false,
        aiEvents: [],
      };
      setFocusMonitor(buildLocalMonitorState('live', 'focus', 0));
    }
    setActiveSession(session);
    setSeconds(mode === 'timer' ? COUNTDOWN_SECONDS : 0);
    setFocusSeconds(0);
    setRunning(true);
    setDistracted(false);
  };

  /** 이탈/집중 복귀 시뮬레이션 — 타이머는 멈추지 않고 경고만 토글 */
  const handleToggleFocus = async () => {
    const next = distracted ? 'focus' : 'distracted';
    if (activeSession && dataSource === 'live' && !activeSession.id.startsWith('local-')) {
      try {
        const { session } = await injectAiEvent(activeSession.id, next);
        setActiveSession(session);
        if (session.focusAlertTriggered) setDistracted(true);
        if (userId) {
          const state = await fetchFocusMonitorState(userId);
          setFocusMonitor(state);
        }
      } catch {
        setFocusMonitor(
          next === 'distracted'
            ? demoFocusMonitorDistracted
            : buildLocalMonitorState('live', 'focus', 0),
        );
      }
    } else {
      setFocusMonitor(buildLocalMonitorState('live', next, 0));
    }
    setDistracted(next === 'distracted');
  };

  const handleResetSession = async () => {
    if (!userId) return;
    try {
      if (dataSource === 'live') {
        await abandonActiveSessions(userId);
        const { focusMonitor: monitor } = await syncTimerHydration(userId);
        setFocusMonitor(monitor);
      }
    } catch {
      setFocusMonitor(buildLocalMonitorState(checkedIn ? 'standby' : 'standby'));
    }
    setActiveSession(null);
    setRunning(false);
    setDistracted(false);
    setMonitorEnded(false);
    setSeconds(0);
    setFocusSeconds(0);
  };

  const handleEnd = async () => {
    if (!userId || !activeSession || ending) return;
    setEnding(true);
    setRunning(false);
    const focusMinutes = Math.max(1, Math.round(focusSeconds / 60));
    try {
      const result = await endStudySession({
        userId,
        sessionId: activeSession.id,
        startedAt: activeSession.startedAt,
        endedAt: new Date().toISOString(),
        focusMinutes,
        satisfaction,
        progress,
        aiEvents: activeSession.aiEvents,
      });
      const [growth, milestones, goals] = await Promise.all([
        fetchGrowth(userId),
        fetchMilestones(userId),
        fetchGoals(userId),
      ]);
      setGrowth(growth);
      setMilestones(milestones);
      setGoals(goals);
      openSettlement(result);
    } catch {
      if (dataSource === 'fixture') {
        openSettlement({ ...demoSettlement, focusMinutes });
      }
    }
    setActiveSession(null);
    setMonitorEnded(true);
    setDistracted(false);
    if (userId && dataSource === 'live') {
      try {
        const state = await fetchFocusMonitorState(userId);
        setFocusMonitor({ ...state, displayMode: 'ended' });
      } catch {
        setFocusMonitor(buildLocalMonitorState('ended'));
      }
    } else {
      setFocusMonitor(buildLocalMonitorState('ended'));
    }
    setEnding(false);
  };

  const isIdle = !activeSession;
  const monitorStateForPanel =
    displayMode === 'live' && focusMonitor
      ? { ...focusMonitor, displayMode: 'live' as const }
      : focusMonitor;
  const showDistractedAlert = !!activeSession && distracted;

  const subjectLabel = !activeSession
    ? '학습을 시작해 보세요'
    : !running
      ? '일시정지됨'
      : distracted
        ? '집중력 이탈 — 집중 시간이 적립되지 않습니다'
        : '집중 학습 중';

  if (hydrating && dataSource === 'live') {
    return (
      <div className="timer-page" data-testid="timer-page">
        <PageState variant="loading" title="학습 상태 동기화 중" testId="timer-hydrating" />
      </div>
    );
  }

  return (
    <div className="timer-page" data-testid="timer-page" data-focus-protected="true">
      <header className="timer-page__head">
        <div>
          <h2>학습 타이머</h2>
          <p className="muted">학습 중에는 집중/이탈 경고 외 알림을 표시하지 않습니다.</p>
        </div>
        <TimerModeToggle mode={mode} disabled={!isIdle} onChange={setMode} />
      </header>

      <div className="timer-page__main">
        <Card className="timer-monitor-card" title="집중 모니터링">
          <WebcamMonitorPanel
            displayMode={displayMode}
            state={
              displayMode === 'live'
                ? monitorStateForPanel ?? buildLocalMonitorState('live')
                : focusMonitor
            }
          />
        </Card>

        <Card className="timer-card">
          {showDistractedAlert && (
            <AlertBanner
              testId="focus-warning"
              title="집중력이 감지되지 않았습니다"
              description="시선이 화면에서 벗어났습니다. 집중 시간은 적립되지 않습니다."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.1A9.5 9.5 0 0 1 12 4.8c5 0 9 4.2 9 7.2a11 11 0 0 1-2.2 3.1M6.3 6.3A11.6 11.6 0 0 0 3 12c0 3 4 7.2 9 7.2 1 0 2-.2 2.9-.5" />
                </svg>
              }
            />
          )}

          <TimerDisplay
            seconds={seconds}
            focusSeconds={focusSeconds}
            subjectLabel={subjectLabel}
          />

          <div className="timer-actions">
            {isIdle ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleStart}
                disabled={hydrating}
                data-testid="start-study"
              >
                학습 시작
              </Button>
            ) : (
              <>
                {!running && (
                  <Button
                    variant="ghost"
                    onClick={handleResetSession}
                    data-testid="reset-study"
                  >
                    학습 초기화
                  </Button>
                )}
                {running ? (
                  <Button
                    variant="secondary"
                    onClick={() => setRunning(false)}
                    data-testid="pause-study"
                  >
                    일시정지
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => setRunning(true)}
                    data-testid="resume-study"
                  >
                    재개
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleToggleFocus}
                  data-testid="simulate-distracted"
                >
                  {distracted ? '집중 복귀 시뮬레이션' : '이탈 시뮬레이션'}
                </Button>
                <Button variant="primary" onClick={handleEnd} loading={ending} data-testid="end-study">
                  학습 종료
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>

      {activeSession && (
        <Card className="timer-end-form" title="학습 종료 시 입력">
          <label className="timer-end-form__row">
            <span>진척도 (1–5)</span>
            <input
              type="range"
              min={1}
              max={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value) as Score)}
              data-testid="progress-input"
            />
            <strong>{progress}</strong>
          </label>
          <label className="timer-end-form__row">
            <span>만족도 (1–5)</span>
            <input
              type="range"
              min={1}
              max={5}
              value={satisfaction}
              onChange={(e) => setSatisfaction(Number(e.target.value) as Score)}
              data-testid="satisfaction-input"
            />
            <strong>{satisfaction}</strong>
          </label>
        </Card>
      )}
    </div>
  );
}
