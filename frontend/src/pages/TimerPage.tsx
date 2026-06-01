import { useEffect, useRef, useState } from 'react';
import { endStudySession, startStudySession } from '../api/study';
import { fetchGoals, fetchGrowth, fetchMilestones } from '../api/growth';
import { useAppStore } from '../stores/useAppStore';
import { formatMinutes } from '../utils/format';
import './TimerPage.css';

export function TimerPage() {
  const userId = useAppStore((s) => s.userId);
  const activeSession = useAppStore((s) => s.activeSession);
  const distractedWarning = useAppStore((s) => s.distractedWarning);
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const openSettlement = useAppStore((s) => s.openSettlement);
  const setDistractedWarning = useAppStore((s) => s.setDistractedWarning);
  const setGrowth = useAppStore((s) => s.setGrowth);
  const setMilestones = useAppStore((s) => s.setMilestones);
  const setGoals = useAppStore((s) => s.setGoals);

  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [satisfaction, setSatisfaction] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [ending, setEnding] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleStart = async () => {
    if (!userId) return;
    const session = await startStudySession({
      userId,
      startedAt: new Date().toISOString(),
    });
    setActiveSession(session);
    setSeconds(0);
    setRunning(true);
    setDistractedWarning(false);
  };

  const handleDistracted = () => {
    setRunning(false);
    setDistractedWarning(true);
  };

  const handleEnd = async () => {
    if (!userId || !activeSession || ending) return;
    setEnding(true);
    setRunning(false);
    const focusMinutes = Math.max(1, Math.round(seconds / 60));
    const result = await endStudySession({
      userId,
      sessionId: activeSession.id,
      startedAt: activeSession.startedAt,
      endedAt: new Date().toISOString(),
      focusMinutes,
      satisfaction,
      aiEvents: activeSession.aiEvents,
    });
    setActiveSession(null);
    const [growth, milestones, goals] = await Promise.all([
      fetchGrowth(userId),
      fetchMilestones(userId),
      fetchGoals(userId),
    ]);
    setGrowth(growth);
    setMilestones(milestones);
    setGoals(goals);
    openSettlement(result);
    setEnding(false);
  };

  return (
    <div className="timer-page" data-testid="timer-page">
      <h2>학습 타이머</h2>
      <p className="muted">학습 중에는 성취·퀘스트 알림을 표시하지 않습니다.</p>

      <div className="timer-display card" data-testid="timer-display">
        {formatMinutes(seconds)}
      </div>

      {distractedWarning && (
        <div className="timer-warning" data-testid="distracted-warning" role="alert">
          집중 이탈이 감지되어 타이머가 일시 정지되었습니다.
        </div>
      )}

      <div className="timer-actions">
        {!activeSession ? (
          <button type="button" onClick={handleStart} data-testid="start-study">
            학습 시작
          </button>
        ) : (
          <>
            {!running && !distractedWarning && (
              <button type="button" onClick={() => setRunning(true)}>
                재개
              </button>
            )}
            <button type="button" onClick={handleDistracted} data-testid="simulate-distracted">
              이탈 시뮬레이션
            </button>
            <button type="button" onClick={handleEnd} disabled={ending} data-testid="end-study">
              학습 종료
            </button>
          </>
        )}
      </div>

      {activeSession && (
        <div className="card timer-end-form">
          <label>
            만족도 (1–5)
            <input
              type="range"
              min={1}
              max={5}
              value={satisfaction}
              onChange={(e) => setSatisfaction(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              data-testid="satisfaction-input"
            />
            <span>{satisfaction}</span>
          </label>
        </div>
      )}
    </div>
  );
}
