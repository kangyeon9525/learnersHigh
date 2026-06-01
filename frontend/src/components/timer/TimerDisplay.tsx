import { formatClock } from '../../utils/format';
import './TimerDisplay.css';

interface Props {
  seconds: number;
  focusSeconds?: number;
  subjectLabel: string;
  showFocusTime?: boolean;
}

/** P1.1.3 — 대형 타이머 디스플레이 */
export function TimerDisplay({
  seconds,
  focusSeconds = 0,
  subjectLabel,
  showFocusTime = true,
}: Props) {
  return (
    <div className="timer-display-block" data-testid="timer-display-block">
      <div className="timer-display" data-testid="timer-display">
        {formatClock(seconds)}
      </div>
      {showFocusTime ? (
        <p className="timer-display-block__focus muted" data-testid="focus-time">
          집중 시간 <strong>{formatClock(focusSeconds)}</strong>
        </p>
      ) : null}
      <p className="timer-display-block__subject muted">{subjectLabel}</p>
    </div>
  );
}
