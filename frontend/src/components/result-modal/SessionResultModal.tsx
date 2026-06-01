import { Link } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import { SessionResultPanel } from './SessionResultPanel';

/** 학습 종료 후에만 노출 — 학습 중 보상 알림 금지 (집중 우선) */
export function SessionResultModal() {
  const show = useAppStore((s) => s.showResultModal);
  const result = useAppStore((s) => s.lastSettlement);
  const close = useAppStore((s) => s.closeSettlement);

  if (!show || !result) return null;

  return (
    <SessionResultPanel
      result={result}
      onClose={close}
      growthAction={
        <Link to="/growth" className="btn-primary" onClick={close} data-testid="go-growth">
          성장 보러가기
        </Link>
      }
    />
  );
}
