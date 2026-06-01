import './TimerModeToggle.css';

export type TimerMode = 'stopwatch' | 'timer';

interface Props {
  mode: TimerMode;
  disabled?: boolean;
  onChange: (mode: TimerMode) => void;
}

/** P1.1.3 / P1.4.1 — 스톱워치·카운트다운 모드 토글 */
export function TimerModeToggle({ mode, disabled = false, onChange }: Props) {
  return (
    <div className="timer-mode" role="tablist" aria-label="타이머 모드">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'stopwatch'}
        className={`timer-mode__btn${mode === 'stopwatch' ? ' timer-mode__btn--active' : ''}`}
        onClick={() => onChange('stopwatch')}
        disabled={disabled}
        data-testid="mode-stopwatch"
      >
        스톱워치
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'timer'}
        className={`timer-mode__btn${mode === 'timer' ? ' timer-mode__btn--active' : ''}`}
        onClick={() => onChange('timer')}
        disabled={disabled}
        data-testid="mode-timer"
      >
        타이머
      </button>
    </div>
  );
}
