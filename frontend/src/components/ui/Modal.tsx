import type { ReactNode } from 'react';
import { useEffect } from 'react';
import './Modal.css';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose?: () => void;
  children: ReactNode;
  testId?: string;
}

/** 접근성 기본 오버레이 모달 — 정산 등은 SessionResultModal 사용 */
export function Modal({ open, title, onClose, children, testId = 'lh-modal' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lh-modal" role="dialog" aria-modal="true" aria-labelledby={`${testId}-title`} data-testid={testId}>
      <button type="button" className="lh-modal__backdrop" aria-label="닫기" onClick={onClose} />
      <div className="lh-modal__panel">
        <header className="lh-modal__header">
          <h2 id={`${testId}-title`} className="lh-modal__title">
            {title}
          </h2>
          {onClose ? (
            <button type="button" className="lh-modal__close" onClick={onClose} aria-label="닫기">
              ×
            </button>
          ) : null}
        </header>
        <div className="lh-modal__body">{children}</div>
      </div>
    </div>
  );
}
