import { Button } from '../ui/Button';
import './FocusWarningModal.css';

interface Props {
  open: boolean;
  onResume: () => void;
  onStop: () => void;
}

/**
 * 집중 이탈 경고 모달 (P1.4 / A2).
 * 학습 중 유일하게 허용되는 알림 — 성취/퀘스트 등 보상 알림은 노출하지 않는다(집중 보호).
 */
export function FocusWarningModal({ open, onResume, onStop }: Props) {
  if (!open) return null;

  return (
    <div className="focus-warning" role="alertdialog" aria-modal="true" data-testid="focus-warning">
      <div className="focus-warning__panel">
        <div className="focus-warning__icon" aria-hidden>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.1A9.5 9.5 0 0 1 12 4.8c5 0 9 4.2 9 7.2a11 11 0 0 1-2.2 3.1M6.3 6.3A11.6 11.6 0 0 0 3 12c0 3 4 7.2 9 7.2 1 0 2-.2 2.9-.5" />
          </svg>
        </div>
        <h3 className="focus-warning__title">집중력이 감지되지 않았습니다</h3>
        <p className="focus-warning__desc">
          사용자의 시선이 화면에서 벗어났습니다.
          <br />
          학습 효율을 위해 다시 집중해 주세요.
        </p>
        <div className="focus-warning__actions">
          <Button variant="primary" onClick={onResume} data-testid="focus-resume">
            계속하기
          </Button>
          <Button variant="ghost" onClick={onStop} data-testid="focus-stop">
            타이머 정지
          </Button>
        </div>
      </div>
    </div>
  );
}
